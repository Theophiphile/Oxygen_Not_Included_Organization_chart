import xml.etree.ElementTree as ET
tree = ET.parse('pouet.xml')
root = tree.getroot()
pouet = root.find(".//diagram[@name='Abyssalite+Wolframite+Tungsten+Insulation']")

with open('index3.html', 'w') as f:
    f.write('''<html><head>
    <link rel="stylesheet" type="text/css" target="_blank" href="style.css">
    <script src="lang/en.js"></script>
    <script src="lang/translate.js"></script>
    </head><body>
''')
    for mxcell in pouet.findall(".//mxCell"):
        style = str(mxcell.get('style'))
        if '/main/' in style:
            left = str(mxcell.find('mxGeometry').get('x'))
            top = str(mxcell.find('mxGeometry').get('y'))
            f.write('<figure class="' + style.split('/main/')[1].split('/')[1] + '" style="position: absolute; left:' + left + 'px;top:' + top)
            f.write('px;"><img src="' + style.split('/main/')[1].split('?')[0].split(';')[0] + '"></figure>\n')
        elif str(mxcell.get('value')) == "":
            mxGeometry = mxcell.find('mxGeometry')
            mxPoints = mxGeometry.findall('mxPoint')
            if mxPoints:
                for p in mxPoints:
                    if p.get('as') == "sourcePoint":
                        startx = p.get('x')
                        starty = p.get('y')
                    if p.get('as') == "targetPoint":
                        endx = p.get('x')
                        endy = p.get('y')
                ET.dump(mxcell)
                f.write('<svg style="position: absolute; left:0; top:0" width="1600" height="1600"><path ')
                f.write('d="M ' + startx + " " + starty + " L " + endx + " " + endy + '"')
                f.write(' stroke="black" fill="transparent"/></svg>\n')                  
                print(startx, starty, endx, endy)
                
    f.write('''</body>
</html>''')
