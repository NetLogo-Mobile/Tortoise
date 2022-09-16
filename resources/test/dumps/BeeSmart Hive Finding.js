var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var PatchSet = tortoise_require('engine/core/patchset');
var PenBundle = tortoise_require('engine/plot/pen');
var Plot = tortoise_require('engine/plot/plot');
var PlotOps = tortoise_require('engine/plot/plotops');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"bee":{"name":"bee","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[152,77,67,67,74,85,100,116,134,151,167,182,206,220,226,226,222],"ycors":[149,163,195,211,234,252,264,276,286,300,285,278,260,242,218,195,166],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[150,128,114,98,80,80,81,95,117,141,151,177,195,207,211,211,204,189,171],"ycors":[149,151,151,145,122,103,83,67,58,54,53,55,66,82,94,116,139,149,152],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[151,119,96,81,78,87,103,115,121,150,180,189,197,210,222,222,212,192],"ycors":[54,59,60,50,39,25,18,23,13,1,14,23,17,19,30,44,57,58],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[70,74,223,224],"ycors":[185,171,172,186],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[67,71,224,225,67],"ycors":[211,226,226,211,211],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[91,106,195,211],"ycors":[257,269,269,255],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":144,"y1":100,"x2":70,"y2":87,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":70,"y1":87,"x2":45,"y2":87,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":86,"x2":26,"y2":97,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":26,"y1":96,"x2":22,"y2":115,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":22,"y1":115,"x2":25,"y2":130,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":26,"y1":131,"x2":37,"y2":141,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":37,"y1":141,"x2":55,"y2":144,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":55,"y1":143,"x2":143,"y2":101,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":141,"y1":100,"x2":227,"y2":138,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":227,"y1":138,"x2":241,"y2":137,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":241,"y1":137,"x2":249,"y2":129,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":249,"y1":129,"x2":254,"y2":110,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":253,"y1":108,"x2":248,"y2":97,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":249,"y1":95,"x2":235,"y2":82,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":235,"y1":82,"x2":144,"y2":100,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":15,"rotate":false,"elements":[{"x":203,"y":65,"diam":88,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":70,"y":65,"diam":162,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":150,"y":105,"diam":120,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[218,240,255,278],"ycors":[120,165,165,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"x":214,"y":72,"diam":67,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"xmin":164,"ymin":223,"xmax":179,"ymax":298,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[45,30,30,15,45],"ycors":[285,285,240,195,210],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":3,"y":83,"diam":150,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xmin":65,"ymin":221,"xmax":80,"ymax":296,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[195,210,210,240,195],"ycors":[285,285,240,210,210],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[276,285,302,294],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"xcors":[219,210,193,201],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"wolf":{"name":"wolf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[253,245,245],"ycors":[133,131,133],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[2,13,30,38,38,20,20,27,38,40,31,31,60,68,75,66,65,82,84,100,103,77,79,100,98,119,143,160,166,172,173,167,160,154,169,178,186,198,200,217,219,207,195,192,210,227,242,259,284,277,293,299,297,273,270],"ycors":[194,197,191,193,205,226,257,265,266,260,253,230,206,198,209,228,243,261,268,267,261,239,231,207,196,201,202,195,210,213,238,251,248,265,264,247,240,260,271,271,262,258,230,198,184,164,144,145,151,141,140,134,127,119,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[-1,14,36,40,53,82,134,159,188,227,236,238,268,269,281,269,269],"ycors":[195,180,166,153,140,131,133,126,115,108,102,98,86,92,87,103,113],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'piping-scouts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('piping-scouts', 'default', function() {
      plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(57, 64, "piping?"); }));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'on-site';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'watching v.s. working';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('watching bees', plotOps.makePenOps, false, new PenBundle.State(136.7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('watching v.s. working', 'watching bees', function() {
      plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(57, 68, "task-string"), "watching-dance"); }));;
    });
  }),
  new PenBundle.Pen('working bees', plotOps.makePenOps, false, new PenBundle.State(56.8, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('watching v.s. working', 'working bees', function() {
      plotManager.plotValue(PrimChecks.math.minus(51, 52, PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("SCOUTS")), PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(72, 83, "task-string"), "watching-dance"); })));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'committed';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "sites", singular: "site", varNames: ["quality", "discovered?", "scouts-on-site"] }, { name: "scouts", singular: "scout", varNames: ["my-home", "next-task", "task-string", "bee-timer", "target", "interest", "trips", "initial-scout?", "no-discovery?", "on-site?", "piping?", "dist-to-hive", "circle-switch", "temp-x-dance", "temp-y-dance"] }])([], [])('breed [ sites site ] breed [ scouts scout ]  sites-own [   quality discovered?   scouts-on-site ] scouts-own [    my-home          ; a bee\'s original position   next-task        ; the code block a bee is running   task-string      ; the behavior a bee is displaying   bee-timer        ; a timer keeping track of the length of the current state                    ;   or the waiting time before entering next state   target           ; the hive that a bee is currently focusing on exploring   interest         ; a bee\'s interest in the target hive   trips            ; times a bee has visited the target    initial-scout?   ; true if it is an initial scout, who explores the unknown horizons   no-discovery?    ; true if it is an initial scout and fails to discover any hive site                    ;   on its initial exploration   on-site?         ; true if it\'s inspecting a hive site   piping?          ; a bee starts to \"pipe\" when the decision of the best hive is made.                    ;   true if a be observes more bees on a certain hive site than the                    ;   quorum or when it observes other bees piping    ; dance related variables:    dist-to-hive     ; the distance between the swarm and the hive that a bee is exploring   circle-switch    ; when making a waggle dance, a bee alternates left and right to make                    ;   the figure \"8\". circle-switch alternates between 1 and -1 to tell                    ;   a bee which direction to turn.   temp-x-dance     ; initial position of a dance   temp-y-dance ]  globals [   color-list       ; colors for hives, which keeps consistency among the hive colors, plot                    ;   pens colors, and committed bees\' colors   quality-list     ; quality of hives    ; visualization:    show-dance-path? ; dance path is the circular patter with a zigzag line in the middle.                    ;   when large amount of bees dance, the patterns overlaps each other,                    ;   which makes them hard to distinguish. turn show-dance-path? off can                    ;   clear existing patterns   scouts-visible?  ; you can hide scouts and only look at the dance patterns to avoid                    ;   distraction from bees\' dancing movements   watch-dance-task ; a list of tasks   discover-task   inspect-hive-task   go-home-task   dance-task   re-visit-task   pipe-task   take-off-task ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;setup;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to setup   clear-all   setup-hives   setup-tasks   setup-bees   set show-dance-path? true   set scouts-visible? true   reset-ticks end  to setup-hives   set color-list [ 97.9 94.5 57.5 63.8 17.6 14.9 27.5 25.1 117.9 114.4 ]   set quality-list [ 100 75 50 1 54 48 40 32 24 16 ]   ask n-of hive-number patches with [     distancexy 0 0 > 16 and abs pxcor < (max-pxcor - 2) and     abs pycor < (max-pycor - 2)   ] [     ; randomly placing hives around the center in the     ; view with a minimum distance of 16 from the center     sprout-sites 1 [       set shape \"box\"       set size 2       set color gray       set discovered? false     ]   ]   let i 0 ; assign quality and plot pens to each hive   repeat count sites [     ask site i [       set quality item i quality-list       set label quality     ]     set-current-plot \"on-site\"     create-temporary-plot-pen word \"site\" i     set-plot-pen-color item i color-list     set-current-plot \"committed\"     create-temporary-plot-pen word \"target\" i     set-plot-pen-color item i color-list     set i i + 1   ] end  to setup-bees   create-scouts 100 [     fd random-float 4 ; let bees spread out from the center     set my-home patch-here     set shape \"bee\"     set color gray     set initial-scout? false     set target nobody     set circle-switch 1     set no-discovery? false     set on-site? false     set piping? false     set next-task watch-dance-task     set task-string \"watching-dance\"   ]   ; assigning some of the scouts to be initial scouts.   ; bee-timer here determines how long they will wait   ; before starting initial exploration   ask n-of (initial-percentage) scouts [     set initial-scout? true     set bee-timer random 100   ] end   to setup-tasks   watch-dance   discover   inspect-hive   go-home   dance   re-visit   pipe   take-off end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;watch-dance;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to watch-dance   set watch-dance-task [ ->     if count scouts with [piping?] in-radius 3 > 0 [       ; if detecting any piping scouts in the swarm, pipe too       set target [target] of one-of scouts with [piping?]       set color [color] of target       set next-task pipe-task       set task-string \"piping\"       set bee-timer 20       set piping? true     ]     move-around     if initial-scout? and bee-timer < 0 [       ; a initial scout, after the waiting period,       ; takes off to discover new hives.       ; it has limited time to do the initial exploration,       ; as specified by initial-explore-time.       set next-task discover-task       set task-string \"discovering\"       set bee-timer initial-explore-time       set initial-scout? false     ]     if not initial-scout? [       ; if a bee is not a initial scout (either born not to be       ; or lost its initial scout status due to the failure of       ; discovery in its initial exploration), it watches other       ; bees in its cone of vision       if bee-timer < 0 [         ; idle bees have bee-timer less than 0, usually as the         ; result of reducing bee-timer from executing other tasks,         ; such as dance         if count other scouts in-cone 3 60 > 0 [           let observed one-of scouts in-cone 3 60           if [ next-task ] of observed = dance-task [             ; randomly pick one dancing bee in its cone of vision             ; random x < 1 means a chance of 1 / x. in this case,             ; x = ((1 / [interest] of observed) * 1000), which is             ; a function to correlate interest, i.e. the enthusiasm             ; of a dance, with its probability of being followed:             ; the higher the interest, the smaller 1 / interest,             ; hence the smaller x, and larger 1 / x, which means             ; a higher probability of being seen.             if random ((1 / [interest] of observed) * 1000) < 1 [               ; follow the dance               set target [target] of observed               ; use white to a bee\'s state of having in mind               ; a target  without having visited it yet               set color white               set next-task re-visit-task               ; re-visit could be an initial scout\'s subsequent               ; visits of a hive after it discovered the hive,               ; or it could be a non-initial scout\'s first visit               ; and subsequent visits to a hive (because non-scouts               ; don\'t make initial visit, which is defined as the               ; discovering visit).               set task-string \"revisiting\"             ]           ]         ]       ]     ]     ; reduce bees\' waiting time by 1 tick     set bee-timer bee-timer - 1   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;discover;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to discover   set discover-task [ ->     ifelse bee-timer < 0 [       ; if run out of time (a bee has limited time to make initial       ; discovery), go home, and admit no discovery was made       set next-task go-home-task       set task-string \"going-home\"       set no-discovery? true     ] [       ; if a bee finds sites around it (within a distance of 3) on its way       ifelse count sites in-radius 3 > 0 [         ; then randomly choose one to focus on         let temp-target one-of sites in-radius 3         ; if this one hive was not discovered by other bees previously         ifelse not [discovered?] of temp-target [           ; commit to this hive           set target temp-target           ask target [             ; make the target as discovered             set discovered? true             set color item who color-list           ]           ; collect info about the target           set interest [ quality ] of target           ; the bee changes its color to show its commitment to this hive           set color [ color ] of target           set next-task inspect-hive-task           set task-string \"inspecting-hive\"           ; will inspect the target for 100 ticks           set bee-timer 100         ] [           ; if no hive site is around, keep going forward           ; with a random heading between [-60, 60] degrees           rt (random 60 - random 60) proceed           set bee-timer bee-timer - 1         ]       ] [         rt (random 60 - random 60) proceed       ]       set bee-timer bee-timer - 1     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;inspect-hive;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to inspect-hive   set inspect-hive-task [ ->     ; after spending certain time (as specified in bee-timer, see the     ; last comment of this task) on inspecting hives, they fly home.     ifelse bee-timer < 0 [       set next-task go-home-task       set task-string \"going-home\"       set on-site? false       set trips trips + 1     ] [       ; while on inspect-hive task,       if distance target > 2 [         face target fd 1 ; a bee flies to its target hive       ]       set on-site? true       ; if it counts more bees than what the quorum specifies, it starts to pipe.       let nearby-scouts scouts with [ on-site? and target = [ target ] of myself ] in-radius 3       if count nearby-scouts > quorum [         set next-task go-home-task         set task-string \"going-home\"         set on-site? false         set piping? true       ]       ; this line makes the visual effect of a bee showing up and disappearing,       ; representing the bee checks both outside and inside of the hive       ifelse random 3 = 0 [ hide-turtle ] [ show-turtle ]       ; a bee knows how far this hive is from its swarm       set dist-to-hive distancexy 0 0       ; the bee-timer keeps track of how long the bee has been inspecting       ; the hive. It lapses as the model ticks. it is set in either the       ; discover task (100 ticks) or the re-visit task (50 ticks).       set bee-timer bee-timer - 1     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;go-home;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to go-home   set go-home-task [ ->     ifelse distance my-home < 1 [ ; if back at home       ifelse no-discovery? [         ; if the bee is an initial scout that failed to discover a hive site         set next-task watch-dance-task         set task-string \"watching-dance\"         set no-discovery? false         ; it loses its initial scout status and becomes a         ; non-scout, who watches other bees\' dances         set initial-scout? false       ] [         ifelse piping? [           ; if the bee saw enough bees on the target site,           ; it prepares to pipe for 20 ticks           set next-task pipe-task           set task-string \"piping\"           set bee-timer 20         ] [           ; if it didn\'t see enough bees on the target site,           ; it prepares to dance to advocate it. it resets           ; the bee-timer to 0 for the dance task           set next-task dance-task           set task-string \"dancing\"           set bee-timer 0         ]       ]     ] [       face my-home proceed     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;dance;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ; bees dance multiple rounds for a good site. After visiting the site for the first ; time, they return to the swarm and make a long dance for it enthusiastically, and ; then go back to visit the site again. When they return, they would dance for it ; for another round, with slightly declined length and enthusiasm. such cycle repeats ; until the enthusiasm is completely gone. in the code below, interest represents ; a bee\'s enthusiasm and the length of the dance. trips keep track of how many times ; the bee has visited the target. after each revisiting trip, the interest declines ; by [15, 19], as represented by (15 + random 5). ; interest - (trips - 1) * (15 + random 5) determines how long a bee will dance after ; each trip. e.g. when a hive is first discovered (trips = 1), if the hive quality is ; 100, i.e. the bee\'s initial interest in this hive is 100, it would dance ; 100 - (1 - 1) * (15 + random 5) = 100. However, after 100 ticks of dance, the bee\'s ; interest in this hive would reduce to [85,81]. ; Assuming it declined to 85, when the bee dances for the hive a second time, it ; would only dance between 60 to 70 ticks: 85 - (2 - 1) * (15 + random 5) = [70, 66] to dance   set dance-task [ ->     ifelse count scouts with [piping?] in-radius 3 > 0 [       ; while dancing, if detecting any piping bee, start piping too       pen-up       set next-task pipe-task       set task-string \"piping\"       set bee-timer 20       set target [target] of one-of scouts with [piping?]       set color [color] of target       set piping? true     ] [       if bee-timer > interest - (trips - 1) * (15 + random 5) and interest > 0 [         ; if a bee dances longer than its current interest, and if it\'s still         ; interested in the target, go to revisit the target again         set next-task re-visit-task         set task-string \"revisiting\"         pen-up         set interest interest - (15 + random 5) ; interest decline by [15,19]         set bee-timer 25                        ; revisit 25 ticks       ]       if bee-timer > interest - (trips - 1) * (15 + random 5) and interest <= 0 [         ; if a bee dances longer than its current interest, and if it\'s no longer         ; interested in the target, as represented by interest <=0, stay in the         ; swarm, rest for 50 ticks, and then watch dance         set next-task watch-dance-task         set task-string \"watching-dance\"         set target nobody         set interest 0         set trips 0         set color gray         set bee-timer 50       ]       if bee-timer <=  interest - (trips - 1) * (15 + random 5) [         ; if a bee dances short than its current interest, keep dancing         ifelse interest <= 50 and random 100 < 43 [           set next-task re-visit-task           set task-string \"revisiting\"           set interest interest - (15 + random 5)           set bee-timer 10         ] [           ifelse show-dance-path? [pen-down][pen-up]           repeat 2 [             waggle             make-semicircle]         ]       ]       set bee-timer bee-timer + 1     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;re-visit;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to re-visit   set re-visit-task [ ->     ifelse bee-timer > 0 [       ; wait a bit after the previous trip       set bee-timer bee-timer - 1     ] [       pen-up       ifelse distance target < 1 [         ; if on target, learn about the target         if interest = 0 [           set interest [ quality ] of target           set color [ color ] of target         ]         set next-task inspect-hive-task         set task-string \"inspecting-hive\"         set bee-timer 50       ] [         ; if hasn\'t reached target yet (distance > 1), keep flying         proceed         face target       ]     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;pipe;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to pipe   set pipe-task [ ->     move-around     if count scouts with [ piping? ] in-radius 5 = count scouts in-radius 5 [       ; if every surrounding bee is piping, wait a bit (20 ticks as       ; set in the watch-dance procedure) for bees to come back to       ; the swarm from the hive before taking off       set bee-timer bee-timer - 1     ]     if bee-timer < 0 [       set next-task take-off-task       set task-string \"taking-off\"     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;take-off;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to take-off   set take-off-task [ ->     ifelse distance target > 1 [       face target fd 1     ] [       set on-site? true     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;run-time;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to go   if all? scouts [ on-site? ] and length remove-duplicates [ target ] of scouts = 1 [   ; if all scouts are on site, and they all have the same target hive, stop.     stop   ]   ask scouts [ run next-task ]   plot-on-site-scouts   tick end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;utilities;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; to make-semicircle   ; calculate the size of the semicircle. 2600 and 5 (in pi / 5) are numbers   ; selected by trial and error to make the dance path look good   let num-of-turns 1 / interest * 2600   let angle-per-turn 180 / num-of-turns   let semicircle 0.5 * dist-to-hive * pi / 5   if circle-switch = 1 [     face target lt 90     repeat num-of-turns [       lt angle-per-turn       fd (semicircle / 180 * angle-per-turn)     ]   ]   if circle-switch = -1 [     face target rt 90     repeat num-of-turns [       rt angle-per-turn       fd (semicircle / 180 * angle-per-turn)     ]   ]    set circle-switch circle-switch * -1   setxy temp-x-dance temp-y-dance end  to waggle   ; pointing the zigzag direction to the target   face target   set temp-x-dance xcor set temp-y-dance ycor   ; switch toggles between 1 and -1, which makes a bee   ; dance a zigzag line by turning left and right   let waggle-switch 1   ; first part of a zigzag line   lt 60   fd .4   ; correlates the number of turns in the zigzag line with the distance   ; between the swarm and the hive. the number 2 is selected by trial   ; and error to make the dance path look good   repeat (dist-to-hive - 2) / 2 [     ; alternates left and right along the diameter line that points to the target     if waggle-switch = 1 [rt 120 fd .8]     if waggle-switch = -1 [lt 120 fd .8]     set waggle-switch waggle-switch * -1   ]   ; finish the last part of the zigzag line   ifelse waggle-switch = -1 [lt 120 fd .4][rt 120 fd .4] end  to proceed   rt (random 20 - random 20)   if not can-move? 1 [ rt 180 ]   fd 1 end  to move-around   rt (random 60 - random 60) fd random-float .1   if distancexy 0 0 > 4 [facexy 0 0 fd 1] end  to plot-on-site-scouts   let i 0   repeat count sites [     set-current-plot \"on-site\"     set-current-plot-pen word \"site\" i     plot count scouts with [on-site? and target = site i]      set-current-plot \"committed\"     set-current-plot-pen word \"target\" i     plot count scouts with [target = site i]      set i i + 1   ] end  to show-hide-dance-path   if show-dance-path? [     clear-drawing   ]   set show-dance-path? not show-dance-path? end  to show-hide-scouts   ifelse scouts-visible? [     ask scouts [hide-turtle]   ]   [     ask scouts [show-turtle]   ]   set scouts-visible? not scouts-visible? end   ; Copyright 2014 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":210,"top":10,"right":933,"bottom":558,"dimensions":{"minPxcor":-32,"maxPxcor":32,"minPycor":-24,"maxPycor":24,"patchSize":11,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":120,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","left":5,"top":190,"right":201,"bottom":226,"display":"Setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":5,"top":235,"right":200,"bottom":275,"display":"Go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"4","compiledMax":"10","compiledStep":"1","variable":"hive-number","left":5,"top":10,"right":201,"bottom":43,"display":"hive-number","min":"4","max":"10","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"5","compiledMax":"25","compiledStep":"1","variable":"initial-percentage","left":5,"top":50,"right":201,"bottom":83,"display":"initial-percentage","min":"5","max":"25","default":12,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('piping-scouts', 'default', function() {     plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed(\"SCOUTS\"), function() { return PrimChecks.turtle.getVariable(57, 64, \"piping?\"); }));;   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot count scouts with [piping?]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"piping-scouts","left":5,"top":415,"right":201,"bottom":579,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot count scouts with [piping?]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[],"display":"on-site","left":942,"top":222,"right":1252,"bottom":426,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('watching v.s. working', 'watching bees', function() {     plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed(\"SCOUTS\"), function() { return Prims.equality(PrimChecks.turtle.getVariable(57, 68, \"task-string\"), \"watching-dance\"); }));;   }); }","display":"watching bees","interval":1,"mode":0,"color":-1398087,"inLegend":true,"setupCode":"","updateCode":"plot count scouts with [task-string = \"watching-dance\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('watching v.s. working', 'working bees', function() {     plotManager.plotValue(PrimChecks.math.minus(51, 52, PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed(\"SCOUTS\")), PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed(\"SCOUTS\"), function() { return Prims.equality(PrimChecks.turtle.getVariable(72, 83, \"task-string\"), \"watching-dance\"); })));;   }); }","display":"working bees","interval":1,"mode":0,"color":-7025278,"inLegend":true,"setupCode":"","updateCode":"plot count scouts - count scouts with [task-string = \"watching-dance\"]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"watching v.s. working","left":942,"top":426,"right":1252,"bottom":579,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"watching bees","interval":1,"mode":0,"color":-1398087,"inLegend":true,"setupCode":"","updateCode":"plot count scouts with [task-string = \"watching-dance\"]","type":"pen"},{"display":"working bees","interval":1,"mode":0,"color":-7025278,"inLegend":true,"setupCode":"","updateCode":"plot count scouts - count scouts with [task-string = \"watching-dance\"]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[],"display":"committed","left":942,"top":10,"right":1252,"bottom":222,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"100","compiledMax":"300","compiledStep":"10","variable":"initial-explore-time","left":5,"top":90,"right":201,"bottom":123,"display":"initial-explore-time","min":"100","max":"300","default":200,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"show-hide-dance-path\"); if (R === StopInterrupt) { return R; }","source":"show-hide-dance-path","left":5,"top":305,"right":200,"bottom":345,"display":"Show/Hide Dance Path","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"show-hide-scouts\"); if (R === StopInterrupt) { return R; }","source":"show-hide-scouts","left":5,"top":350,"right":200,"bottom":390,"display":"Show/Hide Scouts","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"quorum","left":5,"top":130,"right":200,"bottom":163,"display":"quorum","min":"0","max":"50","default":33,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["hive-number", "initial-percentage", "initial-explore-time", "quorum", "color-list", "quality-list", "show-dance-path?", "scouts-visible?", "watch-dance-task", "discover-task", "inspect-hive-task", "go-home-task", "dance-task", "re-visit-task", "pipe-task", "take-off-task"], ["hive-number", "initial-percentage", "initial-explore-time", "quorum"], [], -32, 32, -24, 24, 11, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var PrimChecks = workspace.primChecks;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var ProcedurePrims = workspace.procedurePrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var StringPrims = workspace.stringPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("setup", 2506, 2634, (function() {
  world.clearAll();
  var R = ProcedurePrims.callCommand("setup-hives"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("setup-tasks"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("setup-bees"); if (R === DeathInterrupt) { return R; }
  world.observer.setGlobal("show-dance-path?", true);
  world.observer.setGlobal("scouts-visible?", true);
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("setup-hives", 2642, 3564, (function() {
  world.observer.setGlobal("color-list", [97.9, 94.5, 57.5, 63.8, 17.6, 14.9, 27.5, 25.1, 117.9, 114.4]);
  world.observer.setGlobal("quality-list", [100, 75, 50, 1, 54, 48, 40, 32, 24, 16]);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2782, 2785, 1904, PrimChecks.list.nOf(2786, 2790, PrimChecks.validator.checkArg('N-OF', 2786, 2790, 1, world.observer.getGlobal("hive-number")), PrimChecks.agentset.with(2811, 2815, world.patches(), function() {
    return ((Prims.gt(SelfManager.self().distanceXY(0, 0), 16) && Prims.lt(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 2846, 2849, 1, PrimChecks.patch.getVariable(2850, 2855, "pxcor"))), PrimChecks.math.minus(2869, 2870, world.topology.maxPxcor, 2))) && Prims.lt(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 2882, 2885, 1, PrimChecks.patch.getVariable(2886, 2891, "pycor"))), PrimChecks.math.minus(2905, 2906, world.topology.maxPycor, 2)));
  }))), function() {
    var R = ProcedurePrims.ask(SelfManager.self().sprout(1, "SITES"), function() {
      PrimChecks.turtleOrLink.setVariable(3058, 3063, "shape", "box");
      PrimChecks.turtle.setVariable(3080, 3084, "size", 2);
      PrimChecks.turtleOrLink.setVariable(3097, 3102, "color", 5);
      PrimChecks.turtle.setVariable(3118, 3129, "discovered?", false);
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3031, 3043, R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2782, 2785, R); return R; }
  let i = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("I", i);
  for (let _index_3202_3208 = 0, _repeatcount_3202_3208 = StrictMath.floor(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("SITES"))); _index_3202_3208 < _repeatcount_3202_3208; _index_3202_3208++) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 3227, 3230, 1904, PrimChecks.turtle.getTurtleOfBreed(3231, 3235, "SITES", i)), function() {
      PrimChecks.turtle.setVariable(3250, 3257, "quality", PrimChecks.list.item(3258, 3262, PrimChecks.validator.checkArg('ITEM', 3258, 3262, 1, i), PrimChecks.validator.checkArg('ITEM', 3258, 3262, 12, world.observer.getGlobal("quality-list"))));
      PrimChecks.turtleOrLink.setVariable(3288, 3293, "label", PrimChecks.turtle.getVariable(3294, 3301, "quality"));
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3227, 3230, R); return R; }
    plotManager.setCurrentPlot("on-site");
    plotManager.createTemporaryPen(StringPrims.word("site", i));
    plotManager.setPenColor(PrimChecks.list.item(3406, 3410, PrimChecks.validator.checkArg('ITEM', 3406, 3410, 1, i), PrimChecks.validator.checkArg('ITEM', 3406, 3410, 12, world.observer.getGlobal("color-list"))));
    plotManager.setCurrentPlot("committed");
    plotManager.createTemporaryPen(StringPrims.word("target", i));
    plotManager.setPenColor(PrimChecks.list.item(3526, 3530, PrimChecks.validator.checkArg('ITEM', 3526, 3530, 1, i), PrimChecks.validator.checkArg('ITEM', 3526, 3530, 12, world.observer.getGlobal("color-list"))));
    i = PrimChecks.math.plus(3556, 3557, PrimChecks.validator.checkArg('+', 3556, 3557, 1, i), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("I", i);
  }
}))
ProcedurePrims.defineCommand("setup-bees", 3572, 4206, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(100, "SCOUTS"), function() {
    SelfManager.self().fd(PrimChecks.math.randomFloat(4));
    PrimChecks.turtle.setVariable(3673, 3680, "my-home", SelfManager.self().getPatchHere());
    PrimChecks.turtleOrLink.setVariable(3700, 3705, "shape", "bee");
    PrimChecks.turtleOrLink.setVariable(3720, 3725, "color", 5);
    PrimChecks.turtle.setVariable(3739, 3753, "initial-scout?", false);
    PrimChecks.turtle.setVariable(3768, 3774, "target", Nobody);
    PrimChecks.turtle.setVariable(3790, 3803, "circle-switch", 1);
    PrimChecks.turtle.setVariable(3814, 3827, "no-discovery?", false);
    PrimChecks.turtle.setVariable(3842, 3850, "on-site?", false);
    PrimChecks.turtle.setVariable(3865, 3872, "piping?", false);
    PrimChecks.turtle.setVariable(3887, 3896, "next-task", world.observer.getGlobal("watch-dance-task"));
    PrimChecks.turtle.setVariable(3922, 3933, "task-string", "watching-dance");
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3585, 3598, R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 4106, 4109, 1904, PrimChecks.list.nOf(4110, 4114, PrimChecks.validator.checkArg('N-OF', 4110, 4114, 1, world.observer.getGlobal("initial-percentage")), world.turtleManager.turtlesOfBreed("SCOUTS"))), function() {
    PrimChecks.turtle.setVariable(4153, 4167, "initial-scout?", true);
    PrimChecks.turtle.setVariable(4181, 4190, "bee-timer", RandomPrims.randomLong(100));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(4106, 4109, R); return R; }
}))
ProcedurePrims.defineCommand("setup-tasks", 4215, 4314, (function() {
  var R = ProcedurePrims.callCommand("watch-dance"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("discover"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("inspect-hive"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("go-home"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("dance"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("re-visit"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("pipe"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("take-off"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("watch-dance", 4439, 7166, (function() {
  world.observer.setGlobal("watch-dance-task", PrimChecks.task.checked(4474, 4475, function() {
    if (PrimChecks.agentset.optimizeCount(null, null, SelfManager.self().inRadius(PrimChecks.agentset.with(4499, 4503, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(4505, 4512, "piping?"); }), 3), 0, (a, b) => a > b)) {
      PrimChecks.turtle.setVariable(4604, 4610, "target", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 4620, 4622, 1904, PrimChecks.agentset.oneOfWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(4643, 4650, "piping?"); })), function() { return PrimChecks.turtle.getVariable(4612, 4618, "target"); }));
      PrimChecks.turtleOrLink.setVariable(4662, 4667, "color", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 4676, 4678, 1904, PrimChecks.turtle.getVariable(4679, 4685, "target")), function() { return PrimChecks.turtleOrLink.getVariable(4669, 4674, "color"); }));
      PrimChecks.turtle.setVariable(4696, 4705, "next-task", world.observer.getGlobal("pipe-task"));
      PrimChecks.turtle.setVariable(4726, 4737, "task-string", "piping");
      PrimChecks.turtle.setVariable(4757, 4766, "bee-timer", 20);
      PrimChecks.turtle.setVariable(4780, 4787, "piping?", true);
    }
    var R = ProcedurePrims.callCommand("move-around"); if (R === DeathInterrupt) { return R; }
    if ((PrimChecks.validator.checkArg('AND', 4837, 4840, 2, PrimChecks.turtle.getVariable(4822, 4836, "initial-scout?")) && Prims.lt(PrimChecks.turtle.getVariable(4841, 4850, "bee-timer"), 0))) {
      PrimChecks.turtle.setVariable(5064, 5073, "next-task", world.observer.getGlobal("discover-task"));
      PrimChecks.turtle.setVariable(5098, 5109, "task-string", "discovering");
      PrimChecks.turtle.setVariable(5134, 5143, "bee-timer", world.observer.getGlobal("initial-explore-time"));
      PrimChecks.turtle.setVariable(5175, 5189, "initial-scout?", false);
    }
    if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5209, 5212, 2, PrimChecks.turtle.getVariable(5213, 5227, "initial-scout?")))) {
      if (Prims.lt(PrimChecks.turtle.getVariable(5464, 5473, "bee-timer"), 0)) {
        if (Prims.gt(SelfPrims._optimalCountOther(SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("SCOUTS"), 3, 60)), 0)) {
          let observed = PrimChecks.list.oneOf(5706, 5712, SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("SCOUTS"), 3, 60)); ProcedurePrims.stack().currentContext().registerStringRunVar("OBSERVED", observed);
          if (Prims.equality(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 5760, 5762, 1904, observed), function() { return PrimChecks.turtle.getVariable(5748, 5757, "next-task"); }), world.observer.getGlobal("dance-task"))) {
            if (Prims.lt(PrimChecks.math.random(6314, 6320, PrimChecks.math.mult(6351, 6352, PrimChecks.math.div(6325, 6326, 1, PrimChecks.validator.checkArg('/', 6325, 6326, 1, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 6338, 6340, 1904, observed), function() { return PrimChecks.turtle.getVariable(6328, 6336, "interest"); }))), 1000)), 1)) {
              PrimChecks.turtle.setVariable(6416, 6422, "target", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 6432, 6434, 1904, observed), function() { return PrimChecks.turtle.getVariable(6424, 6430, "target"); }));
              PrimChecks.turtleOrLink.setVariable(6579, 6584, "color", 9.9);
              PrimChecks.turtle.setVariable(6609, 6618, "next-task", world.observer.getGlobal("re-visit-task"));
              PrimChecks.turtle.setVariable(7013, 7024, "task-string", "revisiting");
            }
          }
        }
      }
    }
    PrimChecks.turtle.setVariable(7138, 7147, "bee-timer", PrimChecks.math.minus(7158, 7159, PrimChecks.validator.checkArg('-', 7158, 7159, 1, PrimChecks.turtle.getVariable(7148, 7157, "bee-timer")), 1));
  }, "[ -> if count scouts with [ piping? ] in-radius 3 > 0 [ set target [ target ] of one-of scouts with [ piping? ] set color [ color ] of target set next-task pipe-task set task-string \"piping\" set bee-timer 20 set piping? true ] move-around if initial-scout? and bee-timer < 0 [ set next-task discover-task set task-string \"discovering\" set bee-timer initial-explore-time set initial-scout? false ] if not initial-scout? [ if bee-timer < 0 [ if count other scouts in-cone 3 60 > 0 [ let one-of scouts in-cone 3 60 if [ next-task ] of observed = dance-task [ if random 1 / [ interest ] of observed * 1000 < 1 [ set target [ target ] of observed set color white set next-task re-visit-task set task-string \"revisiting\" ] ] ] ] ] set bee-timer bee-timer - 1 ]", false, false));
}))
ProcedurePrims.defineCommand("discover", 7292, 8833, (function() {
  world.observer.setGlobal("discover-task", PrimChecks.task.checked(7321, 7322, function() {
    if (Prims.lt(PrimChecks.turtle.getVariable(7337, 7346, "bee-timer"), 0)) {
      PrimChecks.turtle.setVariable(7491, 7500, "next-task", world.observer.getGlobal("go-home-task"));
      PrimChecks.turtle.setVariable(7524, 7535, "task-string", "going-home");
      PrimChecks.turtle.setVariable(7559, 7572, "no-discovery?", true);
    }
    else {
      if (PrimChecks.agentset.optimizeCount(null, null, SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SITES"), 3), 0, (a, b) => a > b)) {
        let tempHtarget = PrimChecks.list.oneOf(7775, 7781, SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SITES"), 3)); ProcedurePrims.stack().currentContext().registerStringRunVar("TEMP-TARGET", tempHtarget);
        if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 7886, 7889, 2, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 7904, 7906, 1904, tempHtarget), function() { return PrimChecks.turtle.getVariable(7891, 7902, "discovered?"); })))) {
          PrimChecks.turtle.setVariable(7967, 7973, "target", tempHtarget);
          var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 7996, 7999, 1904, PrimChecks.turtle.getVariable(8000, 8006, "target")), function() {
            PrimChecks.turtle.setVariable(8069, 8080, "discovered?", true);
            PrimChecks.turtleOrLink.setVariable(8102, 8107, "color", PrimChecks.list.item(8108, 8112, PrimChecks.validator.checkArg('ITEM', 8108, 8112, 1, PrimChecks.turtle.getVariable(8113, 8116, "who")), PrimChecks.validator.checkArg('ITEM', 8108, 8112, 12, world.observer.getGlobal("color-list"))));
          }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(7996, 7999, R); return R; }
          PrimChecks.turtle.setVariable(8196, 8204, "interest", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 8217, 8219, 1904, PrimChecks.turtle.getVariable(8220, 8226, "target")), function() { return PrimChecks.turtle.getVariable(8207, 8214, "quality"); }));
          PrimChecks.turtleOrLink.setVariable(8315, 8320, "color", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 8331, 8333, 1904, PrimChecks.turtle.getVariable(8334, 8340, "target")), function() { return PrimChecks.turtleOrLink.getVariable(8323, 8328, "color"); }));
          PrimChecks.turtle.setVariable(8355, 8364, "next-task", world.observer.getGlobal("inspect-hive-task"));
          PrimChecks.turtle.setVariable(8397, 8408, "task-string", "inspecting-hive");
          PrimChecks.turtle.setVariable(8491, 8500, "bee-timer", 100);
        }
        else {
          SelfManager.self().right(PrimChecks.math.minus(8659, 8660, RandomPrims.randomLong(60), RandomPrims.randomLong(60)));
          var R = ProcedurePrims.callCommand("proceed"); if (R === DeathInterrupt) { return R; }
          PrimChecks.turtle.setVariable(8694, 8703, "bee-timer", PrimChecks.math.minus(8714, 8715, PrimChecks.validator.checkArg('-', 8714, 8715, 1, PrimChecks.turtle.getVariable(8704, 8713, "bee-timer")), 1));
        }
      }
      else {
        SelfManager.self().right(PrimChecks.math.minus(8760, 8761, RandomPrims.randomLong(60), RandomPrims.randomLong(60)));
        var R = ProcedurePrims.callCommand("proceed"); if (R === DeathInterrupt) { return R; }
      }
      PrimChecks.turtle.setVariable(8799, 8808, "bee-timer", PrimChecks.math.minus(8819, 8820, PrimChecks.validator.checkArg('-', 8819, 8820, 1, PrimChecks.turtle.getVariable(8809, 8818, "bee-timer")), 1));
    }
  }, "[ -> ifelse bee-timer < 0 [ set next-task go-home-task set task-string \"going-home\" set no-discovery? true ] [ ifelse count sites in-radius 3 > 0 [ let one-of sites in-radius 3 ifelse not [ discovered? ] of temp-target [ set target temp-target ask target [ set discovered? true set color item who color-list ] set interest [ quality ] of target set color [ color ] of target set next-task inspect-hive-task set task-string \"inspecting-hive\" set bee-timer 100 ] [ rt random 60 - random 60 proceed set bee-timer bee-timer - 1 ] ] [ rt random 60 - random 60 proceed ] set bee-timer bee-timer - 1 ] ]", false, false));
}))
ProcedurePrims.defineCommand("inspect-hive", 8958, 10360, (function() {
  world.observer.setGlobal("inspect-hive-task", PrimChecks.task.checked(8995, 8996, function() {
    if (Prims.lt(PrimChecks.turtle.getVariable(9150, 9159, "bee-timer"), 0)) {
      PrimChecks.turtle.setVariable(9176, 9185, "next-task", world.observer.getGlobal("go-home-task"));
      PrimChecks.turtle.setVariable(9209, 9220, "task-string", "going-home");
      PrimChecks.turtle.setVariable(9244, 9252, "on-site?", false);
      PrimChecks.turtle.setVariable(9269, 9274, "trips", PrimChecks.math.plus(9281, 9282, PrimChecks.validator.checkArg('+', 9281, 9282, 1, PrimChecks.turtle.getVariable(9275, 9280, "trips")), 1));
    }
    else {
      if (Prims.gt(SelfManager.self().distance(PrimChecks.turtle.getVariable(9347, 9353, "target")), 2)) {
        SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 9368, 9372, 768, PrimChecks.turtle.getVariable(9373, 9379, "target")));
        SelfManager.self()._optimalFdOne();
      }
      PrimChecks.turtle.setVariable(9436, 9444, "on-site?", true);
      let nearbyHscouts = SelfManager.self().inRadius(PrimChecks.agentset.with(9563, 9567, world.turtleManager.turtlesOfBreed("SCOUTS"), function() {
        return (PrimChecks.validator.checkArg('AND', 9579, 9582, 2, PrimChecks.turtle.getVariable(9570, 9578, "on-site?")) && Prims.equality(PrimChecks.turtle.getVariable(9583, 9589, "target"), PrimChecks.agentset.of(SelfManager.myself(), function() { return PrimChecks.turtle.getVariable(9594, 9600, "target"); })));
      }), 3); ProcedurePrims.stack().currentContext().registerStringRunVar("NEARBY-SCOUTS", nearbyHscouts);
      if (Prims.gt(PrimChecks.agentset.count(PrimChecks.validator.checkArg('COUNT', 9636, 9641, 112, nearbyHscouts)), world.observer.getGlobal("quorum"))) {
        PrimChecks.turtle.setVariable(9679, 9688, "next-task", world.observer.getGlobal("go-home-task"));
        PrimChecks.turtle.setVariable(9714, 9725, "task-string", "going-home");
        PrimChecks.turtle.setVariable(9751, 9759, "on-site?", false);
        PrimChecks.turtle.setVariable(9778, 9785, "piping?", true);
      }
      if (Prims.equality(RandomPrims.randomLong(3), 0)) {
        SelfManager.self().hideTurtle(true);
      }
      else {
        SelfManager.self().hideTurtle(false);
      }
      PrimChecks.turtle.setVariable(10075, 10087, "dist-to-hive", SelfManager.self().distanceXY(0, 0));
      PrimChecks.turtle.setVariable(10326, 10335, "bee-timer", PrimChecks.math.minus(10346, 10347, PrimChecks.validator.checkArg('-', 10346, 10347, 1, PrimChecks.turtle.getVariable(10336, 10345, "bee-timer")), 1));
    }
  }, "[ -> ifelse bee-timer < 0 [ set next-task go-home-task set task-string \"going-home\" set on-site? false set trips trips + 1 ] [ if distance target > 2 [ face target fd 1 ] set on-site? true let scouts with [ on-site? and target = [ target ] of myself ] in-radius 3 if count nearby-scouts > quorum [ set next-task go-home-task set task-string \"going-home\" set on-site? false set piping? true ] ifelse random 3 = 0 [ hide-turtle ] [ show-turtle ] set dist-to-hive distancexy 0 0 set bee-timer bee-timer - 1 ] ]", false, false));
}))
ProcedurePrims.defineCommand("go-home", 10485, 11507, (function() {
  world.observer.setGlobal("go-home-task", PrimChecks.task.checked(10512, 10513, function() {
    if (Prims.lt(SelfManager.self().distance(PrimChecks.turtle.getVariable(10537, 10544, "my-home")), 1)) {
      if (PrimChecks.turtle.getVariable(10582, 10595, "no-discovery?")) {
        PrimChecks.turtle.setVariable(10687, 10696, "next-task", world.observer.getGlobal("watch-dance-task"));
        PrimChecks.turtle.setVariable(10726, 10737, "task-string", "watching-dance");
        PrimChecks.turtle.setVariable(10767, 10780, "no-discovery?", false);
        PrimChecks.turtle.setVariable(10909, 10923, "initial-scout?", false);
      }
      else {
        if (PrimChecks.turtle.getVariable(10955, 10962, "piping?")) {
          PrimChecks.turtle.setVariable(11083, 11092, "next-task", world.observer.getGlobal("pipe-task"));
          PrimChecks.turtle.setVariable(11117, 11128, "task-string", "piping");
          PrimChecks.turtle.setVariable(11152, 11161, "bee-timer", 20);
        }
        else {
          PrimChecks.turtle.setVariable(11361, 11370, "next-task", world.observer.getGlobal("dance-task"));
          PrimChecks.turtle.setVariable(11396, 11407, "task-string", "dancing");
          PrimChecks.turtle.setVariable(11432, 11441, "bee-timer", 0);
        }
      }
    }
    else {
      SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 11476, 11480, 768, PrimChecks.turtle.getVariable(11481, 11488, "my-home")));
      var R = ProcedurePrims.callCommand("proceed"); if (R === DeathInterrupt) { return R; }
    }
  }, "[ -> ifelse distance my-home < 1 [ ifelse no-discovery? [ set next-task watch-dance-task set task-string \"watching-dance\" set no-discovery? false set initial-scout? false ] [ ifelse piping? [ set next-task pipe-task set task-string \"piping\" set bee-timer 20 ] [ set next-task dance-task set task-string \"dancing\" set bee-timer 0 ] ] ] [ face my-home proceed ] ]", false, false));
}))
ProcedurePrims.defineCommand("dance", 12817, 14704, (function() {
  world.observer.setGlobal("dance-task", PrimChecks.task.checked(12840, 12841, function() {
    if (PrimChecks.agentset.optimizeCount(null, null, SelfManager.self().inRadius(PrimChecks.agentset.with(12869, 12873, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(12875, 12882, "piping?"); }), 3), 0, (a, b) => a > b)) {
      SelfManager.self().penManager.raisePen();
      PrimChecks.turtle.setVariable(12994, 13003, "next-task", world.observer.getGlobal("pipe-task"));
      PrimChecks.turtle.setVariable(13024, 13035, "task-string", "piping");
      PrimChecks.turtle.setVariable(13055, 13064, "bee-timer", 20);
      PrimChecks.turtle.setVariable(13078, 13084, "target", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 13094, 13096, 1904, PrimChecks.agentset.oneOfWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(13117, 13124, "piping?"); })), function() { return PrimChecks.turtle.getVariable(13086, 13092, "target"); }));
      PrimChecks.turtleOrLink.setVariable(13136, 13141, "color", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 13150, 13152, 1904, PrimChecks.turtle.getVariable(13153, 13159, "target")), function() { return PrimChecks.turtleOrLink.getVariable(13143, 13148, "color"); }));
      PrimChecks.turtle.setVariable(13170, 13177, "piping?", true);
    }
    else {
      if ((Prims.gt(PrimChecks.turtle.getVariable(13200, 13209, "bee-timer"), PrimChecks.math.minus(13221, 13222, PrimChecks.validator.checkArg('-', 13221, 13222, 1, PrimChecks.turtle.getVariable(13212, 13220, "interest")), PrimChecks.math.mult(13235, 13236, PrimChecks.math.minus(13230, 13231, PrimChecks.validator.checkArg('-', 13230, 13231, 1, PrimChecks.turtle.getVariable(13224, 13229, "trips")), 1), PrimChecks.math.plus(13241, 13242, 15, RandomPrims.randomLong(5))))) && Prims.gt(PrimChecks.turtle.getVariable(13257, 13265, "interest"), 0))) {
        PrimChecks.turtle.setVariable(13429, 13438, "next-task", world.observer.getGlobal("re-visit-task"));
        PrimChecks.turtle.setVariable(13465, 13476, "task-string", "revisiting");
        SelfManager.self().penManager.raisePen();
        PrimChecks.turtle.setVariable(13517, 13525, "interest", PrimChecks.math.minus(13535, 13536, PrimChecks.validator.checkArg('-', 13535, 13536, 1, PrimChecks.turtle.getVariable(13526, 13534, "interest")), PrimChecks.math.plus(13541, 13542, 15, RandomPrims.randomLong(5))));
        PrimChecks.turtle.setVariable(13595, 13604, "bee-timer", 25);
      }
      if ((Prims.gt(PrimChecks.turtle.getVariable(13667, 13676, "bee-timer"), PrimChecks.math.minus(13688, 13689, PrimChecks.validator.checkArg('-', 13688, 13689, 1, PrimChecks.turtle.getVariable(13679, 13687, "interest")), PrimChecks.math.mult(13702, 13703, PrimChecks.math.minus(13697, 13698, PrimChecks.validator.checkArg('-', 13697, 13698, 1, PrimChecks.turtle.getVariable(13691, 13696, "trips")), 1), PrimChecks.math.plus(13708, 13709, 15, RandomPrims.randomLong(5))))) && Prims.lte(PrimChecks.turtle.getVariable(13724, 13732, "interest"), 0))) {
        PrimChecks.turtle.setVariable(13971, 13980, "next-task", world.observer.getGlobal("watch-dance-task"));
        PrimChecks.turtle.setVariable(14010, 14021, "task-string", "watching-dance");
        PrimChecks.turtle.setVariable(14051, 14057, "target", Nobody);
        PrimChecks.turtle.setVariable(14077, 14085, "interest", 0);
        PrimChecks.turtle.setVariable(14100, 14105, "trips", 0);
        PrimChecks.turtleOrLink.setVariable(14120, 14125, "color", 5);
        PrimChecks.turtle.setVariable(14143, 14152, "bee-timer", 50);
      }
      if (Prims.lte(PrimChecks.turtle.getVariable(14173, 14182, "bee-timer"), PrimChecks.math.minus(14196, 14197, PrimChecks.validator.checkArg('-', 14196, 14197, 1, PrimChecks.turtle.getVariable(14187, 14195, "interest")), PrimChecks.math.mult(14210, 14211, PrimChecks.math.minus(14205, 14206, PrimChecks.validator.checkArg('-', 14205, 14206, 1, PrimChecks.turtle.getVariable(14199, 14204, "trips")), 1), PrimChecks.math.plus(14216, 14217, 15, RandomPrims.randomLong(5)))))) {
        if ((Prims.lte(PrimChecks.turtle.getVariable(14317, 14325, "interest"), 50) && Prims.lt(RandomPrims.randomLong(100), 43))) {
          PrimChecks.turtle.setVariable(14368, 14377, "next-task", world.observer.getGlobal("re-visit-task"));
          PrimChecks.turtle.setVariable(14406, 14417, "task-string", "revisiting");
          PrimChecks.turtle.setVariable(14445, 14453, "interest", PrimChecks.math.minus(14463, 14464, PrimChecks.validator.checkArg('-', 14463, 14464, 1, PrimChecks.turtle.getVariable(14454, 14462, "interest")), PrimChecks.math.plus(14469, 14470, 15, RandomPrims.randomLong(5))));
          PrimChecks.turtle.setVariable(14495, 14504, "bee-timer", 10);
        }
        else {
          if (world.observer.getGlobal("show-dance-path?")) {
            SelfManager.self().penManager.lowerPen();
          }
          else {
            SelfManager.self().penManager.raisePen();
          }
          for (let _index_14583_14589 = 0, _repeatcount_14583_14589 = StrictMath.floor(2); _index_14583_14589 < _repeatcount_14583_14589; _index_14583_14589++) {
            var R = ProcedurePrims.callCommand("waggle"); if (R === DeathInterrupt) { return R; }
            var R = ProcedurePrims.callCommand("make-semicircle"); if (R === DeathInterrupt) { return R; }
          }
        }
      }
      PrimChecks.turtle.setVariable(14670, 14679, "bee-timer", PrimChecks.math.plus(14690, 14691, PrimChecks.validator.checkArg('+', 14690, 14691, 1, PrimChecks.turtle.getVariable(14680, 14689, "bee-timer")), 1));
    }
  }, "[ -> ifelse count scouts with [ piping? ] in-radius 3 > 0 [ pen-up set next-task pipe-task set task-string \"piping\" set bee-timer 20 set target [ target ] of one-of scouts with [ piping? ] set color [ color ] of target set piping? true ] [ if bee-timer > interest - trips - 1 * 15 + random 5 and interest > 0 [ set next-task re-visit-task set task-string \"revisiting\" pen-up set interest interest - 15 + random 5 set bee-timer 25 ] if bee-timer > interest - trips - 1 * 15 + random 5 and interest <= 0 [ set next-task watch-dance-task set task-string \"watching-dance\" set target nobody set interest 0 set trips 0 set color gray set bee-timer 50 ] if bee-timer <= interest - trips - 1 * 15 + random 5 [ ifelse interest <= 50 and random 100 < 43 [ set next-task re-visit-task set task-string \"revisiting\" set interest interest - 15 + random 5 set bee-timer 10 ] [ ifelse show-dance-path? [ pen-down ] [ pen-up ] repeat 2 [ waggle make-semicircle ] ] ] set bee-timer bee-timer + 1 ] ]", false, false));
}))
ProcedurePrims.defineCommand("re-visit", 14829, 15429, (function() {
  world.observer.setGlobal("re-visit-task", PrimChecks.task.checked(14858, 14859, function() {
    if (Prims.gt(PrimChecks.turtle.getVariable(14874, 14883, "bee-timer"), 0)) {
      PrimChecks.turtle.setVariable(14943, 14952, "bee-timer", PrimChecks.math.minus(14963, 14964, PrimChecks.validator.checkArg('-', 14963, 14964, 1, PrimChecks.turtle.getVariable(14953, 14962, "bee-timer")), 1));
    }
    else {
      SelfManager.self().penManager.raisePen();
      if (Prims.lt(SelfManager.self().distance(PrimChecks.turtle.getVariable(15010, 15016, "target")), 1)) {
        if (Prims.equality(PrimChecks.turtle.getVariable(15081, 15089, "interest"), 0)) {
          PrimChecks.turtle.setVariable(15110, 15118, "interest", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 15131, 15133, 1904, PrimChecks.turtle.getVariable(15134, 15140, "target")), function() { return PrimChecks.turtle.getVariable(15121, 15128, "quality"); }));
          PrimChecks.turtleOrLink.setVariable(15155, 15160, "color", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 15171, 15173, 1904, PrimChecks.turtle.getVariable(15174, 15180, "target")), function() { return PrimChecks.turtleOrLink.getVariable(15163, 15168, "color"); }));
        }
        PrimChecks.turtle.setVariable(15203, 15212, "next-task", world.observer.getGlobal("inspect-hive-task"));
        PrimChecks.turtle.setVariable(15243, 15254, "task-string", "inspecting-hive");
        PrimChecks.turtle.setVariable(15285, 15294, "bee-timer", 50);
      }
      else {
        var R = ProcedurePrims.callCommand("proceed"); if (R === DeathInterrupt) { return R; }
        SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 15399, 15403, 768, PrimChecks.turtle.getVariable(15404, 15410, "target")));
      }
    }
  }, "[ -> ifelse bee-timer > 0 [ set bee-timer bee-timer - 1 ] [ pen-up ifelse distance target < 1 [ if interest = 0 [ set interest [ quality ] of target set color [ color ] of target ] set next-task inspect-hive-task set task-string \"inspecting-hive\" set bee-timer 50 ] [ proceed face target ] ] ]", false, false));
}))
ProcedurePrims.defineCommand("pipe", 15554, 16001, (function() {
  world.observer.setGlobal("pipe-task", PrimChecks.task.checked(15575, 15576, function() {
    var R = ProcedurePrims.callCommand("move-around"); if (R === DeathInterrupt) { return R; }
    if (Prims.equality(PrimChecks.agentset.count(SelfManager.self().inRadius(PrimChecks.agentset.with(15616, 15620, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(15623, 15630, "piping?"); }), 5)), PrimChecks.agentset.count(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS"), 5)))) {
      PrimChecks.turtle.setVariable(15869, 15878, "bee-timer", PrimChecks.math.minus(15889, 15890, PrimChecks.validator.checkArg('-', 15889, 15890, 1, PrimChecks.turtle.getVariable(15879, 15888, "bee-timer")), 1));
    }
    if (Prims.lt(PrimChecks.turtle.getVariable(15906, 15915, "bee-timer"), 0)) {
      PrimChecks.turtle.setVariable(15932, 15941, "next-task", world.observer.getGlobal("take-off-task"));
      PrimChecks.turtle.setVariable(15966, 15977, "task-string", "taking-off");
    }
  }, "[ -> move-around if count scouts with [ piping? ] in-radius 5 = count scouts in-radius 5 [ set bee-timer bee-timer - 1 ] if bee-timer < 0 [ set next-task take-off-task set task-string \"taking-off\" ] ]", false, false));
}))
ProcedurePrims.defineCommand("take-off", 16126, 16258, (function() {
  world.observer.setGlobal("take-off-task", PrimChecks.task.checked(16155, 16156, function() {
    if (Prims.gt(SelfManager.self().distance(PrimChecks.turtle.getVariable(16180, 16186, "target")), 1)) {
      SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 16199, 16203, 768, PrimChecks.turtle.getVariable(16204, 16210, "target")));
      SelfManager.self()._optimalFdOne();
    }
    else {
      PrimChecks.turtle.setVariable(16234, 16242, "on-site?", true);
    }
  }, "[ -> ifelse distance target > 1 [ face target fd 1 ] [ set on-site? true ] ]", false, false));
}))
ProcedurePrims.defineCommand("go", 16383, 16622, (function() {
  if ((PrimChecks.agentset.all(16391, 16395, world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(16405, 16413, "on-site?"); }) && Prims.equality(PrimChecks.list.length(PrimChecks.list.removeDuplicates(PrimChecks.validator.checkArg('REMOVE-DUPLICATES', 16427, 16444, 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("SCOUTS"), function() { return PrimChecks.turtle.getVariable(16447, 16453, "target"); })))), 1))) {
    return PrimChecks.procedure.stop(16553, 16557);
  }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SCOUTS"), function() {
    var R = PrimChecks.procedure.run(16577, 16580, PrimChecks.validator.checkArg('RUN', 16577, 16580, 2052, PrimChecks.turtle.getVariable(16581, 16590, "next-task"))); if (R !== undefined) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16564, 16567, R); return R; }
  var R = ProcedurePrims.callCommand("plot-on-site-scouts"); if (R === DeathInterrupt) { return R; }
  world.ticker.tick();
}))
ProcedurePrims.defineCommand("make-semicircle", 16747, 17408, (function() {
  let numHofHturns = PrimChecks.math.mult(16937, 16938, PrimChecks.math.div(16926, 16927, 1, PrimChecks.validator.checkArg('/', 16926, 16927, 1, PrimChecks.turtle.getVariable(16928, 16936, "interest"))), 2600); ProcedurePrims.stack().currentContext().registerStringRunVar("NUM-OF-TURNS", numHofHturns);
  let angleHperHturn = PrimChecks.math.div(16969, 16970, 180, PrimChecks.validator.checkArg('/', 16969, 16970, 1, numHofHturns)); ProcedurePrims.stack().currentContext().registerStringRunVar("ANGLE-PER-TURN", angleHperHturn);
  let semicircle = PrimChecks.math.div(17025, 17026, PrimChecks.math.mult(17020, 17021, PrimChecks.math.mult(17005, 17006, 0.5, PrimChecks.validator.checkArg('*', 17005, 17006, 1, PrimChecks.turtle.getVariable(17007, 17019, "dist-to-hive"))), 3.141592653589793), 5); ProcedurePrims.stack().currentContext().registerStringRunVar("SEMICIRCLE", semicircle);
  if (Prims.equality(PrimChecks.turtle.getVariable(17034, 17047, "circle-switch"), 1)) {
    SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 17058, 17062, 768, PrimChecks.turtle.getVariable(17063, 17069, "target")));
    SelfManager.self().right(-(90));
    for (let _index_17080_17086 = 0, _repeatcount_17080_17086 = StrictMath.floor(numHofHturns); _index_17080_17086 < _repeatcount_17080_17086; _index_17080_17086++) {
      SelfManager.self().right(-(angleHperHturn));
      SelfManager.self().fd(PrimChecks.math.mult(17153, 17154, PrimChecks.math.div(17147, 17148, PrimChecks.validator.checkArg('/', 17147, 17148, 1, semicircle), 180), PrimChecks.validator.checkArg('*', 17153, 17154, 1, angleHperHturn)));
    }
  }
  if (Prims.equality(PrimChecks.turtle.getVariable(17186, 17199, "circle-switch"), -1)) {
    SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 17211, 17215, 768, PrimChecks.turtle.getVariable(17216, 17222, "target")));
    SelfManager.self().right(90);
    for (let _index_17233_17239 = 0, _repeatcount_17233_17239 = StrictMath.floor(numHofHturns); _index_17233_17239 < _repeatcount_17233_17239; _index_17233_17239++) {
      SelfManager.self().right(angleHperHturn);
      SelfManager.self().fd(PrimChecks.math.mult(17306, 17307, PrimChecks.math.div(17300, 17301, PrimChecks.validator.checkArg('/', 17300, 17301, 1, semicircle), 180), PrimChecks.validator.checkArg('*', 17306, 17307, 1, angleHperHturn)));
    }
  }
  PrimChecks.turtle.setVariable(17341, 17354, "circle-switch", PrimChecks.math.mult(17369, 17370, PrimChecks.validator.checkArg('*', 17369, 17370, 1, PrimChecks.turtle.getVariable(17355, 17368, "circle-switch")), -1));
  PrimChecks.turtle.setXY(17376, 17381, PrimChecks.validator.checkArg('SETXY', 17376, 17381, 1, PrimChecks.turtle.getVariable(17382, 17394, "temp-x-dance")), PrimChecks.validator.checkArg('SETXY', 17376, 17381, 1, PrimChecks.turtle.getVariable(17395, 17407, "temp-y-dance")));
}))
ProcedurePrims.defineCommand("waggle", 17416, 18238, (function() {
  SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 17473, 17477, 768, PrimChecks.turtle.getVariable(17478, 17484, "target")));
  PrimChecks.turtle.setVariable(17491, 17503, "temp-x-dance", PrimChecks.turtle.getVariable(17504, 17508, "xcor"));
  PrimChecks.turtle.setVariable(17513, 17525, "temp-y-dance", PrimChecks.turtle.getVariable(17526, 17530, "ycor"));
  let waggleHswitch = 1; ProcedurePrims.stack().currentContext().registerStringRunVar("WAGGLE-SWITCH", waggleHswitch);
  SelfManager.self().right(-(60));
  SelfManager.self()._optimalFdLessThan1(0.4);
  for (let _index_17897_17903 = 0, _repeatcount_17897_17903 = StrictMath.floor(PrimChecks.math.div(17923, 17924, PrimChecks.math.minus(17918, 17919, PrimChecks.validator.checkArg('-', 17918, 17919, 1, PrimChecks.turtle.getVariable(17905, 17917, "dist-to-hive")), 2), 2)); _index_17897_17903 < _repeatcount_17897_17903; _index_17897_17903++) {
    if (Prims.equality(waggleHswitch, 1)) {
      SelfManager.self().right(120);
      SelfManager.self()._optimalFdLessThan1(0.8);
    }
    if (Prims.equality(waggleHswitch, -1)) {
      SelfManager.self().right(-(120));
      SelfManager.self()._optimalFdLessThan1(0.8);
    }
    waggleHswitch = PrimChecks.math.mult(18128, 18129, PrimChecks.validator.checkArg('*', 18128, 18129, 1, waggleHswitch), -1); ProcedurePrims.stack().currentContext().updateStringRunVar("WAGGLE-SWITCH", waggleHswitch);
  }
  if (Prims.equality(waggleHswitch, -1)) {
    SelfManager.self().right(-(120));
    SelfManager.self()._optimalFdLessThan1(0.4);
  }
  else {
    SelfManager.self().right(120);
    SelfManager.self()._optimalFdLessThan1(0.4);
  }
}))
ProcedurePrims.defineCommand("proceed", 18246, 18322, (function() {
  SelfManager.self().right(PrimChecks.math.minus(18270, 18271, RandomPrims.randomLong(20), RandomPrims.randomLong(20)));
  if (PrimChecks.math.not(SelfManager.self().canMove(1))) {
    SelfManager.self().right(180);
  }
  SelfManager.self()._optimalFdOne();
}))
ProcedurePrims.defineCommand("move-around", 18330, 18432, (function() {
  SelfManager.self().right(PrimChecks.math.minus(18358, 18359, RandomPrims.randomLong(60), RandomPrims.randomLong(60)));
  SelfManager.self().fd(PrimChecks.math.randomFloat(0.1));
  if (Prims.gt(SelfManager.self().distanceXY(0, 0), 4)) {
    SelfManager.self().faceXY(0, 0);
    SelfManager.self()._optimalFdOne();
  }
}))
ProcedurePrims.defineCommand("plot-on-site-scouts", 18440, 18762, (function() {
  let i = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("I", i);
  for (let _index_18472_18478 = 0, _repeatcount_18472_18478 = StrictMath.floor(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("SITES"))); _index_18472_18478 < _repeatcount_18472_18478; _index_18472_18478++) {
    plotManager.setCurrentPlot("on-site");
    plotManager.setCurrentPen(StringPrims.word("site", i));
    plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() {
      return (PrimChecks.validator.checkArg('AND', 18600, 18603, 2, PrimChecks.turtle.getVariable(18591, 18599, "on-site?")) && Prims.equality(PrimChecks.turtle.getVariable(18604, 18610, "target"), PrimChecks.turtle.getTurtleOfBreed(18613, 18617, "SITES", i)));
    }));
    plotManager.setCurrentPlot("committed");
    plotManager.setCurrentPen(StringPrims.word("target", i));
    plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("SCOUTS"), function() {
      return Prims.equality(PrimChecks.turtle.getVariable(18724, 18730, "target"), PrimChecks.turtle.getTurtleOfBreed(18733, 18737, "SITES", i));
    }));
    i = PrimChecks.math.plus(18754, 18755, PrimChecks.validator.checkArg('+', 18754, 18755, 1, i), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("I", i);
  }
}))
ProcedurePrims.defineCommand("show-hide-dance-path", 18770, 18881, (function() {
  if (world.observer.getGlobal("show-dance-path?")) {
    world.clearDrawing();
  }
  world.observer.setGlobal("show-dance-path?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 18860, 18863, 2, world.observer.getGlobal("show-dance-path?"))));
}))
ProcedurePrims.defineCommand("show-hide-scouts", 18889, 19045, (function() {
  if (world.observer.getGlobal("scouts-visible?")) {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SCOUTS"), function() { SelfManager.self().hideTurtle(true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(18937, 18940, R); return R; }
  }
  else {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SCOUTS"), function() { SelfManager.self().hideTurtle(false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(18974, 18977, R); return R; }
  }
  world.observer.setGlobal("scouts-visible?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 19025, 19028, 2, world.observer.getGlobal("scouts-visible?"))));
}))
world.observer.setGlobal("hive-number", 10);
world.observer.setGlobal("initial-percentage", 12);
world.observer.setGlobal("initial-explore-time", 200);
world.observer.setGlobal("quorum", 33);