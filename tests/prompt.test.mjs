import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
async function setup(){
  const context=vm.createContext({});context.window=context;
  for(const name of ['prompt-engine.js','character-prompt.js','schema.js'])vm.runInContext(await readFile(new URL('assets/'+name,root),'utf8'),context);
  return {schema:context.CharacterSchema,build:v=>context.PromptEngine.build('character-card',v)};
}
test('默认角色卡保留身份参考、三等分布局、胸像边界与禁止文字规则',async()=>{
  const {schema,build}=await setup();const text=build(schema.defaults);
  for(const pattern of [/16:9 aspect ratio/,/Very light neutral-grey seamless backdrop, approximately #EDEDED/,/each occupying one third/,/LEFT VIEW:/,/CENTER VIEW:/,/RIGHT VIEW:/,/mid-chest level/,/same face/,/no watermarks/])assert.match(text,pattern);
  assert.doesNotMatch(text,/undefined|null|__custom|与图片相同|API Key/);
});
test('每一个外形、发型、服装及情绪预设都会改变提示词',async()=>{
  const {schema,build}=await setup();const defaults=schema.defaults;const baseline=build(defaults);
  for(const field of schema.sections.flatMap(s=>s.fields)){
    const options=field.groups?field.groups.flatMap(g=>g[1]):field.options||[];
    for(const value of options.filter(v=>v!=='自定义'&&v!==defaults[field.key])){
      assert.notEqual(build({...defaults,[field.key]:value}),baseline,`${field.key}:${value} 未进入提示词`);
    }
  }
});
test('自定义设定保留原文，自定义情绪覆盖预设，中文眼色不会重复拼接 eyes',async()=>{
  const {schema,build}=await setup();const text=build({...schema.defaults,height:'170cm',outfit:'米白色风衣',etc:'保留面部的小雀斑',eyeColor:'深棕色',emotion:'愤怒',emoNote:'嘴角轻轻上扬，放松的眼神'});
  for(const value of ['170cm','米白色风衣','保留面部的小雀斑','eye color: 深棕色','Expression: 嘴角轻轻上扬，放松的眼神'])assert.ok(text.includes(value),value);
  assert.doesNotMatch(text,/angry glare|深棕色 eyes/);
});
test('仅修改发色不会产生重复 hair，自定义风格按原文生效',async()=>{
  const {schema,build}=await setup();const text=build({...schema.defaults,hairColor:'黑色',photoStyle:'纸感水彩插画'});
  assert.match(text,/CHARACTER: black hair\./);assert.doesNotMatch(text,/hair hair/);assert.match(text,/纸感水彩插画/);assert.doesNotMatch(text,/This is a real photograph/);
});

test('真人肤质按景别分配，保留参考身份且不在全身视图堆叠面部细节',async()=>{
  const {schema,build}=await setup();const text=build(schema.defaults);
  assert.equal(schema.defaults.photoStyle,'逼真真人');
  assert.match(text,/SKIN STATE: Applies only to visible skin in CENTER and RIGHT\. Natural semi-matte skin/);
  const fullBody=text.slice(text.indexOf('LEFT VIEW:'),text.indexOf('RIGHT VIEW:'));
  assert.match(fullBody,/overall tone and broad surface reflectance only/);
  assert.doesNotMatch(fullBody,/pores|iris|under-eye|vellus|lip lines/i);
  const portrait=text.slice(text.indexOf('RIGHT VIEW:'));
  for(const pattern of [/PORTRAIT SKIN:/,/fine forehead texture/,/delicate thin under-eye texture/,/vertical lip lines/,/SKIN CONSISTENCY:/,/reference subject's age/])assert.match(portrait,pattern);
  assert.doesNotMatch(text,/extreme skin detail|adult skin|perfect flawless/i);
});

test('四种皮肤状态互斥，细节强度独立于状态，旧参数和非法枚举使用自然默认值',async()=>{
  const {schema,build}=await setup();
  const stateMarkers=['Natural semi-matte skin','Light post-exercise perspiration','Residual rain moisture','A thin, sheer makeup base'];
  const stateField=schema.sections.flatMap(s=>s.fields).find(f=>f.key==='skinState');
  for(const [i,state] of stateField.options.entries()){
    for(const detail of ['柔和','自然','精细']){
      const text=build({...schema.defaults,skinState:state,skinDetail:detail});
      assert.ok(text.includes(stateMarkers[i]),`${state}/${detail}`);
      for(const [j,marker] of stateMarkers.entries())if(j!==i)assert.ok(!text.includes(marker),`${state} 混入其他皮肤状态`);
    }
  }
  const old={...schema.defaults};delete old.skinState;delete old.skinDetail;delete old.gaze;
  assert.equal(build(old),build(schema.defaults));
  assert.equal(build({...old,skinState:'__proto__',skinDetail:'invalid',gaze:'invalid'}),build(schema.defaults));
  const soft=build({...schema.defaults,skinDetail:'柔和'});
  const fine=build({...schema.defaults,skinDetail:'精细'});
  assert.doesNotMatch(soft,/pores around the nose|vellus hairs/);
  assert.match(fine,/vellus hairs/);
});

test('非摄影风格不叠加真人肤质，隐藏的皮肤选项不影响输出',async()=>{
  const {schema,build}=await setup();
  for(const photoStyle of ['游戏角色','动画电影','3D 渲染','纸感水彩插画']){
    const base=build({...schema.defaults,photoStyle});
    assert.equal(base,build({...schema.defaults,photoStyle,skinState:'雨后湿润',skinDetail:'精细'}));
    assert.doesNotMatch(base,/SKIN STATE:|PORTRAIT SKIN:|SKIN CONSISTENCY:|pores|vellus|iris variation|real photograph/);
  }
  assert.match(build({...schema.defaults,photoStyle:'超写实'}),/PORTRAIT SKIN:/);
});

test('所有预设情绪在闭眼时不再要求睁眼，眨眼与明确视线保持一致',async()=>{
  const {schema,build}=await setup();
  const emotions=schema.sections.flatMap(s=>s.fields).find(f=>f.key==='emotion').groups.flatMap(g=>g[1]);
  for(const emotion of emotions){
    const text=build({...schema.defaults,emotion,gaze:'闭眼'});
    assert.match(text,/Both eyes are gently closed/);
    assert.doesNotMatch(text,/bright eyes|sparkling eyes|wide eyes|dilated pupils|one eye closed|angry glare|icy stare|attentive eyes|sharp gaze|lowered gaze|gaze slightly averted|unfocused eyes|drooping eyelids|half-closed eyes|half-lidded eyes|eyes crinkled|iris variation/,emotion);
  }
  const wink=build({...schema.defaults,emotion:'眨眼',gaze:'看向画面右侧',portraitAngle:'四分之三（左）'});
  for(const pattern of [/playful wink, one eye closed/,/right edge of the image/,/head turned slightly to the left/,/only to the open eye/])assert.match(wink,pattern);
  const shy=build({...schema.defaults,emotion:'害羞微笑',gaze:'看向镜头'});
  assert.match(shy,/toward the camera/);assert.doesNotMatch(shy,/lowered gaze/);
});

test('自定义情绪完整覆盖预设情绪、视线与睁眼细节，避免自由描述冲突',async()=>{
  const {schema,build}=await setup();
  const text=build({...schema.defaults,emotion:'眨眼',gaze:'看向镜头',emoNote:'双眼轻闭，平静地微笑'});
  assert.match(text,/Expression: 双眼轻闭，平静地微笑\./);
  assert.doesNotMatch(text,/Gaze:|playful wink|iris variation|eye rim/);
  assert.equal(text,build({...schema.defaults,emotion:'愤怒',gaze:'闭眼',emoNote:'双眼轻闭，平静地微笑'}));
  const flustered=build({...schema.defaults,emotion:'慌乱'});
  assert.doesNotMatch(flustered,/sweating drop/);
});

test('三块对象在所有风格中保持独立，左侧无头无手，中间保留后脑双手，右侧保留五官',async()=>{
  const {schema,build}=await setup();
  for(const photoStyle of ['逼真真人','超写实','游戏角色','动画电影','3D 渲染','纸感水彩插画']){
    const text=build({...schema.defaults,photoStyle});
    const left=text.slice(text.indexOf('LEFT VIEW:'),text.indexOf('CENTER VIEW:'));
    const center=text.slice(text.indexOf('CENTER VIEW:'),text.indexOf('RIGHT VIEW:'));
    const right=text.slice(text.indexOf('RIGHT VIEW:'),text.indexOf('CROSS-VIEW CONSISTENCY:'));
    assert.match(left,/clothing-only/);
    assert.match(left,/no hands or fingers emerging/);
    assert.match(left,/no human head, face, hair, neck, hands, fingers, exposed skin/);
    assert.doesNotMatch(left,/hands relaxed|full body, front view|For any exposed skin|PORTRAIT IDENTITY:/);
    assert.match(center,/Keep the entire back of the head/);
    assert.match(center,/both human hands visible below the sleeve cuffs/);
    assert.match(center,/Keep both hands within the frame, outside pockets/);
    assert.match(right,/PORTRAIT IDENTITY: In RIGHT/);
    assert.match(right,/same face, same facial structure/);
    assert.ok(text.indexOf('SUBJECT MAP:')<text.indexOf('REFERENCE SCOPE:'));
    assert.doesNotMatch(text,/Identical character, hair, and outfit across all views|same standing pose|CHARACTER: exactly match/);
  }
});

test('自定义外形仍被对象范围约束，肤质不再传播到左侧服装',async()=>{
  const {schema,build}=await setup();
  const text=build({...schema.defaults,hairColor:'黑色',eyeColor:'绿色',bodyType:'结实',outfit:'风衣',skinState:'雨后湿润'});
  const left=text.slice(text.indexOf('LEFT VIEW:'),text.indexOf('CENTER VIEW:'));
  const center=text.slice(text.indexOf('CENTER VIEW:'),text.indexOf('RIGHT VIEW:'));
  const right=text.slice(text.indexOf('RIGHT VIEW:'),text.indexOf('CROSS-VIEW CONSISTENCY:'));
  assert.match(text,/Apply clothing choices to all sections/);
  assert.match(text,/hair choices only to CENTER and RIGHT, and eye color only to RIGHT/);
  assert.match(text,/SKIN STATE: Applies only to visible skin in CENTER and RIGHT/);
  assert.doesNotMatch(left,/Residual rain moisture|overall tone and broad surface reflectance|PORTRAIT SKIN:/);
  assert.match(center,/overall tone and broad surface reflectance only/);
  assert.match(right,/Water creates localized specular reflections/);
});
