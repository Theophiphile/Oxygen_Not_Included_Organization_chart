import xml.etree.ElementTree as ET
tree = ET.parse('pouet.xml')
root = tree.getroot()
pouet = root.find(".//diagram[@name='Abyssalite+Wolframite+Tungsten+Insulation']")

with open('index3.html', 'w') as f:
    f.write('''<html><head>
    <link rel="stylesheet" type="text/css" rel="noopener" target="_blank" href="style.css">
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
    f.write('''</body>
</html>''')
