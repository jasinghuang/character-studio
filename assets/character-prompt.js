// 角色卡三视图提示词骨架，从 Poo AI V2 独立提取。
(function () {
  const g = window;
  const E = g.PromptEngine;
  const phrase = {
    '身高|矮': 'short stature', '身高|平均': 'average height', '身高|高': 'tall',
    '体型|纤瘦': 'skinny', '体型|苗条': 'slim build', '体型|普通': 'average build', '体型|结实': 'athletic toned build', '体型|肌肉': 'muscular build', '体型|微胖': 'chubby build',
    '肤色|白皙': 'fair skin', '肤色|浅色': 'light skin', '肤色|自然': 'medium skin tone', '肤色|小麦色': 'tan skin', '肤色|深色': 'dark skin',
    '头发颜色|黑色': 'black hair', '头发颜色|深棕': 'brown hair', '头发颜色|金色': 'blonde hair', '头发颜色|红色': 'red hair', '头发颜色|银灰': 'silver-gray hair', '头发颜色|白色': 'white hair',
    // CC4:发型预设(cascade 子项)→ 英文;自定义输入走 get() 兜底原样透传
    '发型|长直发': 'long straight hair', '发型|大波浪卷': 'big loose wavy curls', '发型|羊毛卷': 'tight wool curls', '发型|双马尾': 'twin tails',
    '发型|齐肩短发': 'shoulder-length bob', '发型|波波头': 'blunt bob cut', '发型|寸头': 'buzz cut', '发型|高马尾': 'high ponytail', '发型|丸子头': 'top-knot bun', '发型|编发': 'braided hair',
    // CC4:外衣预设(cascade 子项)→ 英文
    '外衣|T 恤牛仔裤': 'a T-shirt and jeans', '外衣|连帽卫衣': 'a hooded sweatshirt', '外衣|针织毛衣': 'a knitted sweater', '外衣|牛仔外套': 'a denim jacket',
    '外衣|衬衫长裤': 'a dress shirt and trousers', '外衣|西装套装': 'a tailored suit', '外衣|风衣': 'a trench coat', '外衣|连衣裙': 'a dress', '外衣|旗袍': 'a qipao', '外衣|羽绒服': 'a down jacket',
    '照片风格|逼真真人': 'This is a real photograph shot on a professional camera — realistic human skin texture with visible pores, natural photographic color and lighting. Not a 3D render, not CGI, not a video game character model, not digital art, not an illustration.',
    '照片风格|超写实': 'Hyperrealistic photography — extreme skin detail, visible pores and fine facial texture, shot on a high-resolution professional camera. Not a 3D render, not CGI, not digital art.',
    '照片风格|游戏角色': 'High-end AAA video game character art style — realtime game engine render quality, detailed stylized-realistic shading.',
    '照片风格|动画电影': 'Anime illustration style — clean line art, cel shading, consistent 2D anime character design.',
    '照片风格|3D 渲染': 'Cinematic 3D rendered character — physically based rendering, soft global illumination, polished CG quality.',
    '面部情绪|平静': 'calm neutral expression, mouth fully closed, relaxed lips', '面部情绪|淡淡微笑': 'soft gentle smile, lips closed', '面部情绪|灿烂笑容': 'bright smile with teeth clearly visible', '面部情绪|坏笑': 'confident smirk, one corner of the mouth raised', '面部情绪|大笑': 'laughing openly, eyes crinkled', '面部情绪|害羞微笑': 'shy bashful smile, slightly lowered gaze', '面部情绪|惊讶': 'surprised expression, raised eyebrows, slightly open mouth', '面部情绪|悲伤': 'sad downcast expression', '面部情绪|哭泣': 'crying, tears running down the cheeks', '面部情绪|愤怒': 'angry glare, furrowed brows', '面部情绪|严肃': 'serious composed expression', '面部情绪|自信': 'confident self-assured expression', '面部情绪|冰冷': 'cold icy stare, emotionless', '面部情绪|深情': 'deeply affectionate expression, tender attentive eyes', '面部情绪|温柔': 'affectionate loving gaze, soft eyes', '面部情绪|咧嘴笑': 'wide grin with teeth showing, cheerful', '面部情绪|腼腆微笑': 'bashful timid smile, gaze slightly averted', '面部情绪|俏皮': 'playful mischievous expression, one eyebrow raised', '面部情绪|眨眼': 'playful wink, one eye closed, slight smile', '面部情绪|开心': 'happy cheerful expression, bright eyes', '面部情绪|喜悦': 'joyful beaming expression, radiant smile', '面部情绪|兴奋': 'excited thrilled expression, wide sparkling eyes', '面部情绪|含泪': 'teary-eyed, glistening tears welling up, sorrowful', '面部情绪|忧郁': 'melancholy gloomy expression, downcast eyes', '面部情绪|暴怒': 'furious enraged expression, intense glare, flushed face', '面部情绪|恼火': 'annoyed irritated expression, slight scowl', '面部情绪|皱眉': 'frowning, deeply furrowed brows', '面部情绪|震惊': 'shocked stunned expression, jaw dropped, wide eyes', '面部情绪|害怕': 'scared fearful expression, trembling, wide eyes', '面部情绪|惊恐': 'terrified panicked expression, dilated pupils', '面部情绪|紧张': 'nervous tense expression, lip biting', '面部情绪|焦虑': 'anxious uneasy expression, furrowed brow', '面部情绪|担忧': 'worried concerned expression, downturned mouth', '面部情绪|怀疑': 'suspicious doubting expression, narrowed eyes, raised eyebrow', '面部情绪|困惑': 'confused puzzled expression, head slightly tilted', '面部情绪|迷茫': 'lost dazed blank expression, unfocused eyes', '面部情绪|疲惫': 'tired exhausted expression, drooping eyelids', '面部情绪|困倦': 'sleepy drowsy expression, half-closed eyes', '面部情绪|无聊': 'bored listless expression, flat gaze', '面部情绪|叹气': 'sighing exasperated expression, half-lidded eyes', '面部情绪|轻蔑': 'contemptuous disdainful look, curled lip', '面部情绪|嘲讽': 'sneering mocking expression, asymmetric smirk', '面部情绪|傲娇': 'haughty proud expression, chin raised, pouty', '面部情绪|坚定': 'determined resolute expression, intense focused eyes', '面部情绪|专注': 'focused attentive expression, sharp gaze', '面部情绪|漫不经心': 'casual nonchalant expression, relaxed detached look', '面部情绪|羞愧': 'ashamed embarrassed expression, blushing cheeks, lowered gaze', '面部情绪|慌乱': 'flustered panicked expression, sweating drop', '面部情绪|渴望': 'longing yearning expression, wistful eyes', '面部情绪|痛苦': 'pained anguished expression, grimacing', '面部情绪|厌恶': 'disgusted repulsed expression, wrinkled nose', '面部情绪|得意': 'triumphant smug expression, self-satisfied grin', '面部情绪|好奇': 'curious inquisitive expression, wide attentive eyes', '面部情绪|感动': 'deeply moved touched expression, teary soft smile',
    '上半身角度|正面': 'front view facing straight toward the camera', '上半身角度|四分之三（右）': 'three-quarter view with the head turned slightly to the right', '上半身角度|四分之三（左）': 'three-quarter view with the head turned slightly to the left',
  };
  const fixed = {
    opening: 'Professional character reference sheet, three views arranged side by side, each occupying one third of the frame width, 16:9 aspect ratio. Very light neutral-grey seamless backdrop, approximately #EDEDED — bright, near-white pale grey, not medium grey or dark grey. Keep the backdrop evenly lit and consistent in tone, with only faint soft contact shadows at the feet. All three views share this one single continuous backdrop — no divider lines, no borders, no gaps, no frames, no separators between the views; the backdrop flows seamlessly across the entire image as one unbroken space.',
    left: 'LEFT VIEW: full body, front view, standing upright in a natural relaxed stance like a fashion lookbook photo, arms hanging straight down naturally at the sides, hands relaxed with fingers gently curled inward. Not an A-pose, not a T-pose, not a 3D-model rig pose. The outfit is displayed in invisible ghost-mannequin style, as if worn by an invisible person: above the collar there is simply empty space blending into the background. No head, no face, no neck stump, no cut surface, no severed edge, no visible flesh above the collar — the collar opening is just empty.',
    center: 'CENTER VIEW: full body, back view, same standing pose, same outfit. The head is kept in this view, showing the back of the head and the hairstyle from behind. No face visible.',
    noText: 'Absolutely no text, no labels, no captions, no watermarks, no letters, no numbers, no logos anywhere in the image. Visual panels only.',
  };
  const get = (label, value) => phrase[label + '|' + value] || E.text(value);
  const same = (value) => E.omitted(value) || value === '与图片相同';

  E.register('character-card', { build(v) {
    const description = [];
    [['身高', v.height], ['体型', v.bodyType], ['肤色', v.skinTone]].forEach(([label, value]) => { if (!same(value)) description.push(get(label, value)); });
    if (!E.omitted(v.eyeColor)) description.push((/[^\x00-\x7F]/.test(E.text(v.eyeColor)) ? 'eye color: ' + E.text(v.eyeColor) : E.text(v.eyeColor) + ' eyes'));   // CC5:眼色槽(自由文本,英文),留空整槽省略
    const hairColor = same(v.hairColor) ? '' : get('头发颜色', v.hairColor);
    const hairStyle = same(v.hairStyle) ? '' : get('发型', v.hairStyle);          // CC4:预设走映射,自定义原样
    if (hairColor && hairStyle) description.push(hairColor.replace(/ hair$/, '') + ' hair in a ' + hairStyle + ' style');
    else if (hairColor) description.push(hairColor);
    else if (hairStyle) description.push(hairStyle);
    if (!same(v.outfit)) description.push('wearing ' + get('外衣', v.outfit));     // CC4:同上

    const angle = (!same(v.portraitAngle) && get('上半身角度', v.portraitAngle)) || phrase['上半身角度|正面'];
    // emoNote(自定义情绪,CC 接通)优先于预设情绪——用户手写描述更具体;都缺省回落「平静」
    const emotion = !E.omitted(v.emoNote) ? E.text(v.emoNote)
      : (!same(v.emotion) && get('面部情绪', v.emotion)) || phrase['面部情绪|平静'];
    // CC8:性别不再有选项——CHARACTER 行与性别段无条件锚定参考图(v4 同款;脸部照片必填使然)
    const character = description.length
      ? 'CHARACTER: ' + description.join(', ') + '. Any attribute not specified above must exactly match the attached reference image.'
      : 'CHARACTER: exactly match the attached reference image — same face, hair, body, and outfit.';
    const gender = 'Gender and facial features must exactly match the attached reference image — same gender, same face, same facial structure. Never change the gender from the reference.';
    const style = !same(v.photoStyle) ? get('照片风格', v.photoStyle) : phrase['照片风格|逼真真人'];
    const parts = [fixed.opening, character, gender];
    if (!E.omitted(v.etc)) parts.push(E.text(v.etc));
    parts.push(fixed.left, fixed.center, 'RIGHT VIEW: one tight chest-up portrait, ' + angle + ', the bottom edge of the frame cuts at mid-chest level — only the head, shoulders and upper chest are visible, the face fills most of its section, face in sharp focus. Do not show the waist, stomach, or lower torso. Fitted inside its own one-third section at the same width and scale proportion as the two full-body views — it must not spread wider than the other views. Expression: ' + emotion + '. This portrait is the only place the face appears on this sheet.', 'Identical character, hair, and outfit across all views. Professional studio softbox lighting, consistent proportions between all three views. ' + style, fixed.noText);
    return parts.join('\n\n');
  }});
})();
