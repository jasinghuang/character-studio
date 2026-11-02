from pathlib import Path
from PIL import Image
from html import escape
import hashlib
import json
import shutil

out = Path(__file__).resolve().parent
sources = {
    'before-1': 'exec-beb994f3-3261-4e1e-81ce-ae2a9f16077e.png',
    'before-2': 'exec-7d0f1370-5237-489f-98be-6b1228fd42cf.png',
    'after-1': 'exec-86abe7f8-8c1f-4120-bb4b-0ee70fc1e119.png',
    'after-2': 'exec-8f1f67ed-3b1e-476f-9bf1-0e0881a21bc6.png',
}
generated = Path('/Users/jasing/.codex/generated_images/01a18646-c2e7-7e12-80f7-4c561221de95')
manifest = json.loads((out / 'manifest.json').read_text())
manifest['outputs'] = []
for label, filename in sources.items():
    dest = out / f'{label}.png'
    shutil.copyfile(generated / filename, dest)
    with Image.open(dest) as im:
        size = list(im.size)
    manifest['outputs'].append({'label': label, 'file': dest.name, 'size': size, 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()})
shutil.copyfile(out.parents[2] / 'assets/character-example.jpg', out / 'reference.jpg')
manifest['requestedSize'] = [2048, 1152]
manifest['actualSize'] = [1672, 941]
manifest['assessment'] = {
    'method': 'Qualitative visual inspection of both replicates; no blinded raters, no fixed seed, no biometric or skin-quality scoring.',
    'conclusion': 'Subtle texture differences, but no demonstrated consistent overall improvement in this small sample.',
    'observations': [
        'Both versions broadly retain the reference face, hairstyle and outfit.',
        'The revised outputs suggest slightly more apparent cheek/nose texture, but the difference is small and not a robust superiority finding.',
        'The first revised sample also has somewhat more apparent under-eye shading; more visible texture should not be equated with greater naturalness.',
        'No clear repeatable improvement in gaze or compliance with the specified camera-left key light.',
        'The second revised output omits one front-view hand and shows only part of the other.',
        'Portrait clothing/shoulders extend beyond the nominal rightmost third in all samples; the revised outputs do not solve this.',
    ],
    'limitations': ['Only two replicates per version.', 'A generated three-view sheet is reused as reference, priming composition and appearance.', 'Exact model version and seed are not exposed by the tool.', 'The tool returned 1672x941 rather than the requested 2048x1152; skin microdetail is difficult to judge.', 'Only the default semi-matte/natural-detail/calm setting was compared; other states and expressions were not validated.'],
}
(out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

cards = []
for number in (1, 2):
    cards.append(f'<h2>第 {number} 次重复</h2><div class="pair">')
    for version, name in [('before', '旧版'), ('after', '新版')]:
        cards.append(f'<figure><figcaption>{name} · {number}</figcaption><a class="frame" href="{version}-{number}.png" target="_blank" aria-label="打开{name}第{number}张原图"><img src="{version}-{number}.png" alt="{name}第{number}张角色卡" loading="eager"></a></figure>')
    cards.append('</div>')
prompts = []
for version, name in [('before', '旧版'), ('after', '新版')]:
    en = escape((out / f'{version}-en.txt').read_text())
    zh = escape((out / f'{version}-zh.txt').read_text())
    prompts.append(f'<details><summary>{name}完整提示词 · 中英对照</summary><p>实际生成输入为英文；中文仅作语义对照。两次重复使用相同英文输入。</p><div class="translations"><section><h3>English</h3><pre>{en}</pre></section><section><h3>中文</h3><pre>{zh}</pre></section></div></details>')

page = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Character Studio · 提示词出图对照</title>
<style>
:root{font-family:system-ui,-apple-system,"PingFang SC",sans-serif;color:#20221c;background:#f7f8f4;line-height:1.65}*{box-sizing:border-box}body{margin:0}main{max-width:1440px;padding:32px 24px 64px;margin:auto}h1{font-size:30px;margin:8px 0 12px}h2{font-size:19px;margin:28px 0 12px}p{margin:8px 0;color:#555d50}.eyebrow{font-size:12px;letter-spacing:2px;color:#616b58}.conclusion{padding:20px 24px;background:#fff;border:1px solid #dce2d3;border-left:5px solid #91b64c;border-radius:12px;margin:22px 0}.conclusion strong{font-size:19px}.toolbar{position:sticky;top:0;z-index:2;background:#f7f8f4f2;backdrop-filter:blur(10px);padding:12px 0;display:flex;gap:10px;align-items:center;border-bottom:1px solid #dde2d5}button{font:inherit;padding:8px 15px;border:1px solid #ccd4c0;border-radius:8px;background:#fff;cursor:pointer}button[aria-pressed=true]{background:#26331c;color:white}.toolbar span{font-size:12px;color:#626b5a}.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}figure{margin:0;background:white;border:1px solid #dde2d5;border-radius:12px;overflow:hidden}figcaption{padding:10px 15px;font-weight:650}.frame{display:block;aspect-ratio:1672/941;overflow:hidden;background:#eceee7}.frame img{width:100%;height:auto;display:block}.portrait .frame{aspect-ratio:1672/2823}.portrait .frame img{width:300%;max-width:none;transform:translateX(-66.6666667%)}table{width:100%;border-collapse:collapse;background:white;margin:18px 0}td,th{padding:11px 14px;text-align:left;border:1px solid #dde2d5;vertical-align:top}th{background:#edf1e7}details{background:white;border:1px solid #dde2d5;border-radius:10px;padding:14px 18px;margin:14px 0}summary{font-weight:650;cursor:pointer}.translations{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}pre{font:13px/1.7 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0}.limitations{font-size:13px}.reference img{max-width:100%;display:block}a{color:#3c611d}@media(max-width:680px){main{padding:24px 14px 40px}h1{font-size:24px}.pair,.translations{grid-template-columns:1fr}.toolbar{flex-wrap:wrap}.portrait .frame{aspect-ratio:1672/2823}td,th{padding:8px;font-size:12px}}
</style><main><div class="eyebrow">CHARACTER STUDIO / IMAGE VALIDATION</div><h1>新增肤质规则，是否改善实际出图？</h1><p>2026-11-02 · 同一参考图、同一内置 imagegen 工具路径，旧版与新版各生成 2 张。新版使用自然半哑光／自然细节／随表情／平静。</p>
<div class="conclusion"><strong>初步结论：尚未证实稳定的整体改善。</strong><p>局部肤质略有增强趋势，眼神与人物一致性大致相当。新版仍出现手部缺失和胸像占宽问题。此结论来自小样目视检查。</p></div>
<div class="toolbar"><button id="full" aria-pressed="true">完整角色卡</button><button id="portrait" aria-pressed="false">右侧人像对照</button><span>点击图片可打开原图。人像模式仅改变显示范围，原文件未修改。</span></div>
''' + ''.join(cards) + '''
<h2>逐项观察</h2><table><thead><tr><th>项目</th><th>本轮结果</th></tr></thead><tbody>
<tr><td>人物、发型、服装保持</td><td>两版总体接近共同参考，未观察到明确且可重复的新版优势。</td></tr>
<tr><td>面部皮肤纹理</td><td>新版面颊、鼻部的细节略显可见，但差异小；第 1 张新版的眼下阴影也更明显，增加纹理不等于自然感提高。当前图像尺寸不足以可靠核验全部微细节。</td></tr>
<tr><td>高光与光线</td><td>两版均偏柔光，没有观察到新版稳定呈现更清楚的指定左侧主光结构。</td></tr>
<tr><td>眼神</td><td>平静、朝镜头的效果大致相当，未证明新增文字带来明显改善。</td></tr>
<tr><td>手部与三视图布局</td><td>新版第 2 张左侧手部不完整；所有样本右侧胸像的肩部／衣服都向三分之一边界以外扩展。</td></tr>
</tbody></table>
<h2>本轮能说明什么</h2><p>新增规则能够进入生成请求，但“写入要求”与“模型稳定执行”需要分别判断。当前样本支持继续保留这些可控模块，但不足以宣称人物明显更真实或给出改善百分比。</p>
<p class="limitations">限制：每版仅 2 张；未进行盲评；工具不提供固定种子和精确模型版本；使用已有生成三视图作为参考，会强化其构图与外观；要求 2048×1152，实际返回均为 1672×941。本轮只覆盖默认皮肤状态与自然细节，未测试微汗、雨后、底妆及各类表情。</p>
<h2>可复查的输入</h2><details class="reference"><summary>共同参考图</summary><img src="reference.jpg" alt="双方共同使用的原 AI 示例三视图"></details>
''' + ''.join(prompts) + '''
<p><a href="manifest.json">运行记录与文件校验信息</a></p></main><script>
const full=document.getElementById('full'),portrait=document.getElementById('portrait');
function mode(crop){document.body.classList.toggle('portrait',crop);full.setAttribute('aria-pressed',String(!crop));portrait.setAttribute('aria-pressed',String(crop));}
full.addEventListener('click',()=>mode(false));portrait.addEventListener('click',()=>mode(true));
</script></html>'''
(out / 'comparison.html').write_text(page)
print(out / 'comparison.html')
