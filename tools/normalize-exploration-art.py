"""Extract generated art into transparent fixed cells. No artistic redrawing."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'assets/exploracao'

def box(im):
    b=im.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()
    assert b, 'Empty source cell'
    return b

def build():
    source=Image.open(ART/'fontes/objetos.png').convert('RGBA')
    frames=[]
    for row in range(2):
        for col in range(4):
            slot=source.crop((round(col*source.width/4),round(row*source.height/2),round((col+1)*source.width/4),round((row+1)*source.height/2)))
            frames.append(slot.crop(box(slot)))
    sheet=Image.new('RGBA',(128,64))
    for i,frame in enumerate(frames):
        scale=min(28/frame.width,28/frame.height)
        frame=frame.resize((max(1,round(frame.width*scale)),max(1,round(frame.height*scale))),Image.Resampling.NEAREST)
        sheet.alpha_composite(frame,((i%4)*32+(32-frame.width)//2,(i//4)*32+(32-frame.height)//2))
    sheet.save(ART/'objetos.png',optimize=True)
    source=Image.open(ART/'fontes/criado-mudo.png').convert('RGBA')
    halves=[source.crop((round(i*source.width/2),0,round((i+1)*source.width/2),source.height)) for i in range(2)]
    boxes=[box(im) for im in halves];top=min(b[1] for b in boxes)
    scale=min(36/max(b[2]-b[0] for b in boxes),52/max(b[3]-top for b in boxes))
    sheet=Image.new('RGBA',(96,64))
    for i,(im,b) in enumerate(zip(halves,boxes)):
        # Common top and scale keep the fixed cabinet body anchored in both states.
        im=im.crop((b[0],top,b[2],max(z[3] for z in boxes)))
        im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.NEAREST)
        sheet.alpha_composite(im,(i*48+(48-im.width)//2,5))
    sheet.save(ART/'criado-mudo.png',optimize=True)
    for name in ['objetos','criado-mudo']:
        im=Image.open(ART/(name+'.png'));bg=Image.new('RGBA',im.size,'#211b20');bg.alpha_composite(im)
        bg.resize((im.width*6,im.height*6),Image.Resampling.NEAREST).convert('RGB').save(ROOT/'previas/exploracao'/(name+'.png'))
    print('Props 128x64, nightstand 96x64; transparent runtime sheets')
if __name__=='__main__':build()
