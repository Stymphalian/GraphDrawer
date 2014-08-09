(function(GD){
   console.log("Welcome to GraphDrawer!\n");      
})(window.GD = window.GD || {});


$(document).ready( function(){      
      //console.debug("Document ready!");
      GD.model = new GD.Model();
      GD.view = new GD.View(GD.model);
      GD.controller = new GD.Controller(GD.model,GD.view);
   
      // hook handlers
      GD.controller.hookHandlers();
   
      // run tests.
      GD.model.graph.testGraph();
})
