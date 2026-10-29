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
