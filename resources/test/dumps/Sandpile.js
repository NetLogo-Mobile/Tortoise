var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Errors = tortoise_require('util/errors');
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
var Random = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average grain count', 'average')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("total")), PrimChecks.agentset.count(world.patches())));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "ticks", "grains", false, true, 0, 1, 2, 2.1, setup, update);
})(), (function() {
  var name    = 'Avalanche sizes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal("sizes")))))) {
            plotManager.resetPen();
            let counts = Tasks.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal("sizes")))), Tasks.reporterTask(function() { return 0; }, "[ 0 ]")); letVars['counts'] = counts;
            var _foreach_138_145 = Tasks.forEach(Tasks.commandTask(function(theSize) {
              Errors.procedureArgumentsCheck(1, arguments.length);
              counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, theSize), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, theSize), PrimChecks.validator.checkArg('ITEM', 12, counts))))); letVars['counts'] = counts;
            }, "[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]"), world.observer.getGlobal("sizes")); if(reporterContext && _foreach_138_145 !== undefined) { return _foreach_138_145; }
            let s = 0; letVars['s'] = s;
            var _foreach_253_260 = Tasks.forEach(Tasks.commandTask(function(c) {
              Errors.procedureArgumentsCheck(1, arguments.length);
              if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
                plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, s), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));
              }
              s = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, s), 1); letVars['s'] = s;
            }, "[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]"), counts); if(reporterContext && _foreach_253_260 !== undefined) { return _foreach_253_260; }
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log size", "log count", false, true, 0, 1, 0, 1, setup, update);
})(), (function() {
  var name    = 'Avalanche lifetimes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal("lifetimes")))))) {
            plotManager.resetPen();
            let counts = Tasks.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal("lifetimes")))), Tasks.reporterTask(function() { return 0; }, "[ 0 ]")); letVars['counts'] = counts;
            var _foreach_146_153 = Tasks.forEach(Tasks.commandTask(function(lifetime) {
              Errors.procedureArgumentsCheck(1, arguments.length);
              counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, lifetime), PrimChecks.validator.checkArg('ITEM', 12, counts))))); letVars['counts'] = counts;
            }, "[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]"), world.observer.getGlobal("lifetimes")); if(reporterContext && _foreach_146_153 !== undefined) { return _foreach_146_153; }
            let l = 0; letVars['l'] = l;
            var _foreach_265_272 = Tasks.forEach(Tasks.commandTask(function(c) {
              Errors.procedureArgumentsCheck(1, arguments.length);
              if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
                plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, l), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));
              }
              l = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, l), 1); letVars['l'] = l;
            }, "[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]"), counts); if(reporterContext && _foreach_265_272 !== undefined) { return _foreach_265_272; }
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, true, 0, 1, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [   ;; By always keeping track of how much sand is on the table, we can compute the   ;; average number of grains per patch instantly, without having to count.   total   ;; We don\'t want the average monitor to updating wildly, so we only have it   ;; update every tick.   total-on-tick   ;; Keep track of avalanche sizes so we can histogram them   sizes   ;; Size of the most recent run   last-size   ;; Keep track of avalanche lifetimes so we can histogram them   lifetimes   ;; Lifetime of the most recent run   last-lifetime   ;; The patch the mouse hovers over while exploring   selected-patch   ;; These colors define how the patches look normally, after being fired, and in   ;; explore mode.   default-color   fired-color   selected-color ]  patches-own [   ;; how many grains of sand are on this patch   n   ;; A list of stored n so that we can easily pop back to a previous state. See   ;; the NETLOGO FEATURES section of the Info tab for a description of how stacks   ;; work   n-stack   ;; Determines what color to scale when coloring the patch.   base-color ]  ;; The input task says what each patch should do at setup time ;; to compute its initial value for n.  (See the Tasks section ;; of the Programming Guide for information on tasks.) to setup [setup-task]   clear-all    set default-color blue   set fired-color red   set selected-color green    set selected-patch nobody   ask patches [     set n runresult setup-task     set n-stack []     set base-color default-color   ]   let ignore stabilize false   ask patches [ recolor ]   set total sum [ n ] of patches   ;; set this to the empty list so we can add items to it later   set sizes []   set lifetimes []   reset-ticks end  ;; For example, \"setup-uniform 2\" gives every patch a task which reports 2. to setup-uniform [initial]   setup [ -> initial ] end  ;; Every patch uses a task which reports a random value. to setup-random   setup [ -> random 4 ] end  ;; patch procedure; the colors are like a stoplight to recolor   set pcolor scale-color base-color n 0 4 end  to go   let drop drop-patch   if drop != nobody [     ask drop [       update-n 1       recolor     ]     let results stabilize animate-avalanches?     let avalanche-patches first results     let lifetime last results      ;; compute the size of the avalanche and throw it on the end of the sizes list     if any? avalanche-patches [       set sizes lput (count avalanche-patches) sizes       set lifetimes lput lifetime lifetimes     ]     ;; Display the avalanche and guarantee that the border of the avalanche is updated     ask avalanche-patches [ recolor ask neighbors4 [ recolor ] ]     display     ;; Erase the avalanche     ask avalanche-patches [ set base-color default-color recolor ]     ;; Updates the average monitor     set total-on-tick total     tick   ] end  to explore   ifelse mouse-inside? [     let p patch mouse-xcor mouse-ycor     set selected-patch p     ask patches [ push-n ]     ask selected-patch [ update-n 1 ]     let results stabilize false     ask patches [ pop-n ]     ask patches [ set base-color default-color recolor ]     let avalanche-patches first results     ask avalanche-patches [ set base-color selected-color recolor ]     display   ] [     if selected-patch != nobody [       set selected-patch nobody       ask patches [ set base-color default-color recolor ]     ]   ] end  ;; Stabilizes the sandpile. Reports which sites fired and how many iterations it took to ;; stabilize. to-report stabilize [animate?]   let active-patches patches with [ n > 3 ]    ;; The number iterations the avalanche has gone for. Use to calculate lifetimes.   let iters 0    ;; we want to count how many patches became overloaded at some point   ;; during the avalanche, and also flash those patches. so as we go, we\'ll   ;; keep adding more patches to to this initially empty set.   let avalanche-patches no-patches    while [ any? active-patches ] [     let overloaded-patches active-patches with [ n > 3 ]     if any? overloaded-patches [       set iters iters + 1     ]     ask overloaded-patches [       set base-color fired-color       ;; subtract 4 from this patch       update-n -4       if animate? [ recolor ]       ;; edge patches have less than four neighbors, so some sand may fall off the edge       ask neighbors4 [         update-n 1         if animate? [ recolor ]       ]     ]     if animate? [ display ]     ;; add the current round of overloaded patches to our record of the avalanche     ;; the patch-set primitive combines agentsets, removing duplicates     set avalanche-patches (patch-set avalanche-patches overloaded-patches)     ;; find the set of patches which *might* be overloaded, so we will check     ;; them the next time through the loop     set active-patches patch-set [ neighbors4 ] of overloaded-patches   ]   report (list avalanche-patches iters) end  ;; patch procedure. input might be positive or negative, to add or subtract sand to update-n [ how-much ]   set n n + how-much   set total total + how-much end  to-report drop-patch   if drop-location = \"center\" [ report patch 0 0 ]   if drop-location = \"random\" [ report one-of patches ]   if drop-location = \"mouse-click\" and mouse-down? [     every 0.3 [ report patch mouse-xcor mouse-ycor ]   ]   report nobody end  ;; Save the patches state to push-n ;; patch procedure   set n-stack fput n n-stack end  ;; restore the patches state to pop-n ;; patch procedure   ; need to go through update-n to keep total statistic correct   update-n ((first n-stack) - n)   set n-stack but-last n-stack end   ; Public Domain: ; To the extent possible under law, Uri Wilensky has waived all ; copyright and related or neighboring rights to this model.')([{"left":330,"top":10,"right":742,"bottom":423,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":90,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_46 = procedures[\"SETUP-UNIFORM\"](world.observer.getGlobal(\"grains-per-patch\"));   if (_maybestop_33_46 instanceof Exception.StopInterrupt) { return _maybestop_33_46; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup-uniform grains-per-patch","left":5,"top":45,"right":150,"bottom":79,"display":"setup uniform","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":5,"top":100,"right":150,"bottom":133,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average grain count', 'average')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"total\")), PrimChecks.agentset.count(world.patches())));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average grain count","left":0,"top":260,"right":310,"bottom":445,"xAxis":"ticks","yAxis":"grains","xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"total-on-tick\")), PrimChecks.agentset.count(world.patches()))","source":"total-on-tick / count patches","left":245,"top":215,"right":310,"bottom":260,"display":"average","precision":4,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"animate-avalanches?","left":155,"top":140,"right":325,"bottom":173,"display":"animate-avalanches?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"drop-location","left":5,"top":140,"right":150,"bottom":185,"display":"drop-location","choices":["center","random","mouse-click"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_45 = procedures[\"SETUP-RANDOM\"]();   if (_maybestop_33_45 instanceof Exception.StopInterrupt) { return _maybestop_33_45; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup-random","left":5,"top":10,"right":150,"bottom":43,"display":"setup random","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal(\"sizes\")))))) {           plotManager.resetPen();           let counts = Tasks.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal(\"sizes\")))), Tasks.reporterTask(function() { return 0; }, \"[ 0 ]\")); letVars['counts'] = counts;           var _foreach_138_145 = Tasks.forEach(Tasks.commandTask(function(theSize) {             Errors.procedureArgumentsCheck(1, arguments.length);             counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, theSize), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, theSize), PrimChecks.validator.checkArg('ITEM', 12, counts))))); letVars['counts'] = counts;           }, \"[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]\"), world.observer.getGlobal(\"sizes\")); if(reporterContext && _foreach_138_145 !== undefined) { return _foreach_138_145; }           let s = 0; letVars['s'] = s;           var _foreach_253_260 = Tasks.forEach(Tasks.commandTask(function(c) {             Errors.procedureArgumentsCheck(1, arguments.length);             if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {               plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, s), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));             }             s = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, s), 1); letVars['s'] = s;           }, \"[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]\"), counts); if(reporterContext && _foreach_253_260 !== undefined) { return _foreach_253_260; }         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche sizes","left":755,"top":240,"right":955,"bottom":390,"xAxis":"log size","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   world.observer.setGlobal(\"sizes\", []);   world.observer.setGlobal(\"lifetimes\", []);   plotManager.setCurrentPlot(\"Avalanche lifetimes\");   plotManager.setYRange(0, 1);   plotManager.setXRange(0, 1);   plotManager.setCurrentPlot(\"Avalanche sizes\");   plotManager.setYRange(0, 1);   plotManager.setXRange(0, 1); } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"set sizes [] set lifetimes [] set-current-plot \"Avalanche lifetimes\" set-plot-y-range 0 1 set-plot-x-range 0 1 set-current-plot \"Avalanche sizes\" set-plot-y-range 0 1 set-plot-x-range 0 1","left":755,"top":400,"right":955,"bottom":433,"display":"clear size and lifetime data","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal(\"lifetimes\")))))) {           plotManager.resetPen();           let counts = Tasks.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal(\"lifetimes\")))), Tasks.reporterTask(function() { return 0; }, \"[ 0 ]\")); letVars['counts'] = counts;           var _foreach_146_153 = Tasks.forEach(Tasks.commandTask(function(lifetime) {             Errors.procedureArgumentsCheck(1, arguments.length);             counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, lifetime), PrimChecks.validator.checkArg('ITEM', 12, counts))))); letVars['counts'] = counts;           }, \"[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]\"), world.observer.getGlobal(\"lifetimes\")); if(reporterContext && _foreach_146_153 !== undefined) { return _foreach_146_153; }           let l = 0; letVars['l'] = l;           var _foreach_265_272 = Tasks.forEach(Tasks.commandTask(function(c) {             Errors.procedureArgumentsCheck(1, arguments.length);             if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {               plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, l), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));             }             l = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, l), 1); letVars['l'] = l;           }, \"[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]\"), counts); if(reporterContext && _foreach_265_272 !== undefined) { return _foreach_265_272; }         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche lifetimes","left":755,"top":80,"right":955,"bottom":230,"xAxis":"log lifetime","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_40 = procedures[\"EXPLORE\"]();   if (_maybestop_33_40 instanceof Exception.StopInterrupt) { return _maybestop_33_40; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"explore","left":5,"top":210,"right":150,"bottom":243,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":155,"top":100,"right":325,"bottom":133,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"3","compiledStep":"1","variable":"grains-per-patch","left":155,"top":45,"right":325,"bottom":78,"display":"grains-per-patch","min":"0","max":"3","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["animate-avalanches?", "drop-location", "grains-per-patch", "total", "total-on-tick", "sizes", "last-size", "lifetimes", "last-lifetime", "selected-patch", "default-color", "fired-color", "selected-color"], ["animate-avalanches?", "drop-location", "grains-per-patch"], ["n", "n-stack", "base-color"], -50, 50, -50, 50, 4, false, false, turtleShapes, linkShapes, function(){});
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
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var procs = {};
  var temp = undefined;
  temp = (function(setupTask) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.observer.setGlobal("default-color", 105);
      world.observer.setGlobal("fired-color", 15);
      world.observer.setGlobal("selected-color", 55);
      world.observer.setGlobal("selected-patch", Nobody);
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("n", Prims.runCode(
          true,
          (function() {
            let _run_1426_1435Vars = { }; for(var v in letVars) { _run_1426_1435Vars[v] = letVars[v]; }
            _run_1426_1435Vars["SETUP-TASK"] = setupTask;
            return _run_1426_1435Vars;
          })(),
          setupTask
        )
        
        );
        SelfManager.self().setPatchVariable("n-stack", []);
        SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
      }, true);
      let ignore = procedures["STABILIZE"](false); letVars['ignore'] = ignore;
      Errors.askNobodyCheck(world.patches()).ask(function() { procedures["RECOLOR"](); }, true);
      world.observer.setGlobal("total", PrimChecks.list.sum(PrimChecks.validator.checkArg('SUM', 8, PrimChecks.agentset.of(world.patches(), function() { return SelfManager.self().getPatchVariable("n"); }))));
      world.observer.setGlobal("sizes", []);
      world.observer.setGlobal("lifetimes", []);
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function(initial) {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"](Tasks.reporterTask(function() { return initial; }, "[ -> initial ]"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupUniform"] = temp;
  procs["SETUP-UNIFORM"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"](Tasks.reporterTask(function() { return RandomPrims.randomLong(4); }, "[ -> random 4 ]"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupRandom"] = temp;
  procs["SETUP-RANDOM"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(SelfManager.self().getPatchVariable("base-color"), SelfManager.self().getPatchVariable("n"), 0, 4));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let drop = procedures["DROP-PATCH"](); letVars['drop'] = drop;
      if (!Prims.equality(drop, Nobody)) {
        Errors.askNobodyCheck(drop).ask(function() {
          procedures["UPDATE-N"](1);
          procedures["RECOLOR"]();
        }, true);
        let results = procedures["STABILIZE"](world.observer.getGlobal("animate-avalanches?")); letVars['results'] = results;
        let avalanchePatches = PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, results)); letVars['avalanchePatches'] = avalanchePatches;
        let lifetime = PrimChecks.list.last(PrimChecks.validator.checkArg('LAST', 12, results)); letVars['lifetime'] = lifetime;
        if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, avalanchePatches))) {
          world.observer.setGlobal("sizes", PrimChecks.list.lput(PrimChecks.agentset.count(PrimChecks.validator.checkArg('COUNT', 112, avalanchePatches)), PrimChecks.validator.checkArg('LPUT', 8, world.observer.getGlobal("sizes"))));
          world.observer.setGlobal("lifetimes", PrimChecks.list.lput(lifetime, PrimChecks.validator.checkArg('LPUT', 8, world.observer.getGlobal("lifetimes"))));
        }
        Errors.askNobodyCheck(avalanchePatches).ask(function() {
          procedures["RECOLOR"]();
          Errors.askNobodyCheck(SelfManager.self().getNeighbors4()).ask(function() { procedures["RECOLOR"](); }, true);
        }, true);
        notImplemented('display', undefined)();
        Errors.askNobodyCheck(avalanchePatches).ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          procedures["RECOLOR"]();
        }, true);
        world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
        world.ticker.tick();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (MousePrims.isInside()) {
        let p = world.getPatchAt(MousePrims.getX(), MousePrims.getY()); letVars['p'] = p;
        world.observer.setGlobal("selected-patch", p);
        Errors.askNobodyCheck(world.patches()).ask(function() { procedures["PUSH-N"](); }, true);
        Errors.askNobodyCheck(world.observer.getGlobal("selected-patch")).ask(function() { procedures["UPDATE-N"](1); }, true);
        let results = procedures["STABILIZE"](false); letVars['results'] = results;
        Errors.askNobodyCheck(world.patches()).ask(function() { procedures["POP-N"](); }, true);
        Errors.askNobodyCheck(world.patches()).ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          procedures["RECOLOR"]();
        }, true);
        let avalanchePatches = PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, results)); letVars['avalanchePatches'] = avalanchePatches;
        Errors.askNobodyCheck(avalanchePatches).ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("selected-color"));
          procedures["RECOLOR"]();
        }, true);
        notImplemented('display', undefined)();
      }
      else {
        if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
          world.observer.setGlobal("selected-patch", Nobody);
          Errors.askNobodyCheck(world.patches()).ask(function() {
            SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
            procedures["RECOLOR"]();
          }, true);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["explore"] = temp;
  procs["EXPLORE"] = temp;
  temp = (function(animate_p) {
    try {
      var reporterContext = true;
      var letVars = { };
      let activePatches = PrimChecks.agentset.with(world.patches(), function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['activePatches'] = activePatches;
      let iters = 0; letVars['iters'] = iters;
      let avalanchePatches = new PatchSet([], world); letVars['avalanchePatches'] = avalanchePatches;
      while (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, activePatches))) {
        let overloadedPatches = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, activePatches), function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['overloadedPatches'] = overloadedPatches;
        if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, overloadedPatches))) {
          iters = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, iters), 1); letVars['iters'] = iters;
        }
        Errors.askNobodyCheck(overloadedPatches).ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("fired-color"));
          procedures["UPDATE-N"](-4);
          if (animate_p) {
            procedures["RECOLOR"]();
          }
          Errors.askNobodyCheck(SelfManager.self().getNeighbors4()).ask(function() {
            procedures["UPDATE-N"](1);
            if (animate_p) {
              procedures["RECOLOR"]();
            }
          }, true);
        }, true);
        if (animate_p) {
          notImplemented('display', undefined)();
        }
        avalanchePatches = PrimChecks.agentset.patchSet(avalanchePatches, overloadedPatches); letVars['avalanchePatches'] = avalanchePatches;
        activePatches = PrimChecks.agentset.patchSet(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, overloadedPatches), function() { return SelfManager.self().getNeighbors4(); })); letVars['activePatches'] = activePatches;
      }
      Errors.reportInContextCheck(reporterContext);
      return ListPrims.list(avalanchePatches, iters);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["stabilize"] = temp;
  procs["STABILIZE"] = temp;
  temp = (function(howMuch) {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("n", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getPatchVariable("n")), PrimChecks.validator.checkArg('+', 1, howMuch)));
      world.observer.setGlobal("total", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("total")), PrimChecks.validator.checkArg('+', 1, howMuch)));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["updateN"] = temp;
  procs["UPDATE-N"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
        Errors.reportInContextCheck(reporterContext);
        return world.getPatchAt(0, 0);
      }
      if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
        Errors.reportInContextCheck(reporterContext);
        return PrimChecks.list.oneOf(world.patches());
      }
      if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
        if (Prims.isThrottleTimeElapsed("dropPatch_0", workspace.selfManager.self(), 0.3)) {
          Prims.resetThrottleTimerFor("dropPatch_0", workspace.selfManager.self());
          Errors.reportInContextCheck(reporterContext);
          return world.getPatchAt(MousePrims.getX(), MousePrims.getY());
        }
      }
      Errors.reportInContextCheck(reporterContext);
      return Nobody;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["dropPatch"] = temp;
  procs["DROP-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("n-stack", PrimChecks.list.fput(PrimChecks.validator.checkArg('FPUT', 8191, SelfManager.self().getPatchVariable("n")), PrimChecks.validator.checkArg('FPUT', 8, SelfManager.self().getPatchVariable("n-stack"))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["pushN"] = temp;
  procs["PUSH-N"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["UPDATE-N"](PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, SelfManager.self().getPatchVariable("n-stack")))), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getPatchVariable("n"))));
      SelfManager.self().setPatchVariable("n-stack", PrimChecks.list.butLast('but-last', PrimChecks.validator.checkArg('BUT-LAST', 12, SelfManager.self().getPatchVariable("n-stack"))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["popN"] = temp;
  procs["POP-N"] = temp;
  return procs;
})();
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);