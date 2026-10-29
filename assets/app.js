(function () {
  'use strict';
  const {sections,defaults} = window.CharacterSchema;
  const key = 'character-studio.draft.v1';
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields = sections.flatMap(s => s.fields);
  let values = {...defaults}, modes = {}, custom = {}, categories = {}, active = 'basics', generated = '', prompt = '', edited = false, timer, restoreBeforeReset;
  let storageOK = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const field of fields) if (typeof saved.values?.[field.key] === 'string') values[field.key] = saved.values[field.key].slice(0,10000);
      for (const name of ['modes','custom','categories']) if (saved[name] && typeof saved[name] === 'object') {
        const target = name === 'modes' ? modes : name === 'custom' ? custom : categories;
        for (const field of fields) if (typeof saved[name][field.key] === 'string') target[field.key] = saved[name][field.key];
      }
      if (sections.some(s=>s.id===saved.active)) active = saved.active;
      if (typeof saved.prompt === 'string') prompt = saved.prompt.slice(0,100000);
      if (typeof saved.generated === 'string') generated = saved.generated.slice(0,100000);
      edited = !!saved.edited;
    }
  } catch { storageOK = false; }
  function save() {
    try { localStorage.setItem(key, JSON.stringify({values,modes,custom,categories,active,prompt,generated,edited})); storageOK = true; }
    catch { storageOK = false; }
    $('draftStatus').textContent = storageOK ? '设定自动保存在当前浏览器' : '浏览器暂不能保存草稿，仍可生成并复制提示词';
  }
  function build() { return window.PromptEngine.build('character-card',values); }
  function chip(field,value,selected,extra='') {
    return '<button type="button" class="chip'+(selected?' selected':'')+'" data-choice="'+escape(field.key)+'" data-value="'+escape(value)+'" aria-pressed="'+selected+'" '+extra+'>'+escape(value)+'</button>';
  }
  function renderField(field) {
    const v = values[field.key] || '', isCustom = modes[field.key] === 'custom';
    let body = '';
    if (field.type === 'choice') {
      body = '<div class="chips" role="group" aria-label="'+escape(field.label)+'">'+field.options.map(o => o==='自定义' ? chip(field,o,isCustom) : chip(field,o,!isCustom&&v===o)).join('')+'</div>';
    } else if (field.type === 'cascade') {
      let category = categories[field.key];
      if (!field.groups.some(g=>g[0]===category) && category!=='自定义') category = isCustom ? '自定义' : field.groups.find(g=>g[1].includes(v))?.[0] || field.groups[0][0];
      const options = field.groups.find(g=>g[0]===category)?.[1] || [];
      body = '<div class="category-tabs" role="group" aria-label="'+escape(field.label)+'分类">'+[...field.groups.map(g=>g[0]),'自定义'].map(name=>'<button type="button" class="category'+(category===name?' selected':'')+'" data-category="'+escape(field.key)+'" data-value="'+escape(name)+'" aria-pressed="'+(category===name)+'">'+escape(name)+'</button>').join('')+'</div>';
      if (category!=='自定义') body += '<div class="chips sub-options" role="group" aria-label="'+escape(field.label)+'选项">'+options.map(o=>chip(field,o,!isCustom&&v===o)).join('')+'</div>';
    } else {
      const attrs = ' id="field-'+escape(field.key)+'" data-field="'+escape(field.key)+'" placeholder="'+escape(field.placeholder||'')+'" maxlength="3000"';
      body = field.type==='textarea' ? '<textarea rows="3"'+attrs+'>'+escape(v)+'</textarea>' : '<input type="text"'+attrs+' value="'+escape(v)+'">';
    }
    if (isCustom && ['choice','cascade'].includes(field.type)) body += '<input class="custom-input" type="text" id="field-'+escape(field.key)+'" data-field="'+escape(field.key)+'" aria-label="自定义'+escape(field.label)+'" value="'+escape(v)+'" placeholder="描述你想要的'+escape(field.label)+'" maxlength="3000">';
    return '<div class="field"><'+(['choice','cascade'].includes(field.type)?'div':'label for="field-'+escape(field.key)+'"')+' class="field-label">'+escape(field.label)+(field.type==='text'||field.type==='textarea'?'<span>选填</span>':'')+'</'+(['choice','cascade'].includes(field.type)?'div':'label')+'>'+body+(field.help?'<p class="field-help">'+escape(field.help)+'</p>':'')+'</div>';
  }
  function render() {
    $('fields').innerHTML = '<nav class="section-tabs" aria-label="角色设定分类">'+sections.map((s,i)=>'<button type="button" data-section="'+s.id+'" aria-pressed="'+(active===s.id)+'" class="section-tab'+(active===s.id?' selected':'')+'"><span>0'+(i+1)+'</span>'+escape(s.title)+'</button>').join('')+'</nav>'+sections.map(s=>'<section class="setting-pane" '+(s.id===active?'':'hidden')+' aria-label="'+escape(s.title)+'"><p class="pane-description">'+escape(s.description)+'</p>'+s.fields.map(renderField).join('')+'</section>').join('');
    updateOutput();
  }
  function updateOutput() {
    const dirty = generated && build() !== generated;
    $('promptState').textContent = !prompt ? '等待生成' : dirty ? '设定已更新' : edited ? '已手动编辑' : '已生成';
    $('promptState').classList.toggle('dirty',!!dirty);
    $('generateLabel').textContent = prompt ? dirty ? '更新提示词' : '重新生成提示词' : '生成提示词';
    $('copy').disabled = !prompt.trim() || !!dirty;
    $('promptCount').textContent = prompt ? prompt.length.toLocaleString('zh-CN')+' 字符'+(dirty?' · 复制前请更新':'') : '英文提示词 · 自定义内容原样保留';
  }
  function toast(message) { clearTimeout(timer); $('toast').textContent=message; $('toast').hidden=false; timer=setTimeout(()=>{$('toast').hidden=true;},2600); }
  $('settingsForm').addEventListener('submit', e=>e.preventDefault());
  $('fields').addEventListener('click',event=>{
    const section = event.target.closest('[data-section]');
    if(section){active=section.dataset.section;render();save();return;}
    const button = event.target.closest('[data-choice],[data-category]');if(!button)return;
    const name = button.dataset.choice || button.dataset.category;
    const field = fields.find(f=>f.key===name);if(!field)return;
    const value = button.dataset.value;
    if(button.dataset.category){categories[name]=value;}
    if(value==='自定义'){modes[name]='custom';values[name]=custom[name]||'';if(field.type==='cascade')categories[name]='自定义';}
    else {const options=button.dataset.category?field.groups.find(g=>g[0]===value)[1]:null;const next=options?(options.includes(values[name])?values[name]:options[0]):value;delete modes[name];values[name]=next;}
    render();save();
    if(value==='自定义') $('field-'+name).focus();
    else document.querySelector('[data-'+(button.dataset.category?'category':'choice')+'="'+name+'"][data-value="'+CSS.escape(value)+'"]')?.focus({preventScroll:true});
  });
  $('fields').addEventListener('input',event=>{
    const name=event.target.dataset.field;if(!name)return;
    values[name]=event.target.value;if(modes[name]==='custom')custom[name]=values[name];updateOutput();save();
  });
  $('generate').addEventListener('click',()=>{
    const incomplete=fields.find(f=>modes[f.key]==='custom'&&!values[f.key].trim());
    if(incomplete){active=sections.find(s=>s.fields.includes(incomplete)).id;render();$('field-'+incomplete.key).focus();toast('请填写自定义'+incomplete.label+'，或选择一个预设');return;}
    prompt=generated=build();edited=false;$('prompt').value=prompt;$('copyHelp').hidden=true;updateOutput();save();toast('提示词已生成，可以直接复制');
  });
  $('prompt').addEventListener('input',event=>{prompt=event.target.value;edited=true;updateOutput();save();});
  $('copy').addEventListener('click',async()=>{
    if(!prompt.trim())return;
    try {await navigator.clipboard.writeText(prompt);}
    catch {
      $('prompt').focus();$('prompt').select();
      try {if(!document.execCommand('copy'))throw Error();}
      catch {$('copyHelp').hidden=false;toast('请使用键盘复制已选中的提示词');return;}
    }
    $('copyLabel').textContent='已复制';toast('已复制 · 记得在生图网站附上人物参考照片');
    setTimeout(()=>{$('copyLabel').textContent='复制提示词';},2000);
  });
  $('reset').addEventListener('click',()=>{
    if(restoreBeforeReset){({values,modes,custom,categories,active,prompt,generated,edited}=restoreBeforeReset);restoreBeforeReset=null;$('reset').textContent='恢复默认';toast('已恢复刚才的设定');}
    else {restoreBeforeReset={values:{...values},modes:{...modes},custom:{...custom},categories:{...categories},active,prompt,generated,edited};values={...defaults};modes={};custom={};categories={};active='basics';prompt='';generated='';edited=false;$('reset').textContent='撤销重置';toast('已恢复默认，可点击「撤销重置」返回');}
    $('prompt').value=prompt;$('copyHelp').hidden=true;render();save();
  });
  $('exampleOpen').addEventListener('click',()=>$('exampleDialog').showModal());
  $('exampleClose').addEventListener('click',()=>$('exampleDialog').close());
  $('exampleDialog').addEventListener('click',event=>{if(event.target===$('exampleDialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
  $('prompt').value=prompt;render();save();
})();
