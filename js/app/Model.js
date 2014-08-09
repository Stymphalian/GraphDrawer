(function(){
      
   function Model(){
      this.graph = new GD.Graph();
      this.current_state = Model.prototype.StatesEnum.NONE;      
      this.data = {}      
   }
         
   Model.prototype.StatesEnum = {
      NONE:0,
      ADD_VERTEX: 1,
      RM_VERTEX: 2,
      ADD_EDGE: 3,
      RM_EDGE: 4      
   };
   Model.prototype.PrintEnum = {
      EDGE_LIST: 1,
      ADJ_MATRIX: 2,
      ADJ_LIST: 3
   };
   
   Model.prototype.trans_state = function(next_state){
      this.current_state = next_state; 
      var m = this;
      
      if( m.current_state === m.StatesEnum.NONE){
         this.data ={};
      }else if( m.current_state  === m.StatesEnum.ADD_VERTEX){                                 
      }else if( m.current_state  === m.StatesEnum.RM_VERTEX){         
      }else if( m.current_state  === m.StatesEnum.ADD_EDGE){
         this.data = {state:0};
      }else if( m.current_state  === m.StatesEnum.RM_EDGE){         
      } 
   }   
   
   Model.prototype.addVertex = function(x,y){
      // create the graph vertex
      var graph_node = this.graph.addVertex();
            
      // create the DOM node.
      var node = $('<div>')
         .appendTo("#vertex_display")
         .addClass("circle vertex")         
         .css({
           "position":"absolute",
            "left":x,
            "top":y
         })
         .attr("id", "vertex_"+ graph_node.id)
         .data("vertex",graph_node);
            
      node.draggable({
         drag:function(e,ui){
            var v = $(e.target).data("vertex");
            var v1,v2,e;
            
            v.edges.forEach(function(elem,i,arr){
               v1 = $("#vertex_" + elem.from.id);
               v2 = $("#vertex_" + elem.to.id);
               e = $("#edge_" + elem.id);
               
                              
               if( elem.from !== v ){
                  var temp = v2;
                  v2 = v1;
                  v1 = temp;                  
               }                                    
               place_line(e,
                          v1.position().left+20,
                          v1.position().top +20,
                          v2.position().left+20,
                          v2.position().top +20);                
            });            
         }         
      });
      return node;      
   };   
   
   
   function place_line(line,x,y,x1,y1){
      var len = Math.sqrt((x-x1)*(x-x1) + (y-y1)*(y-y1));
      var angle = Math.atan2(y1-y,x1-x)*(180/Math.PI);
      var transform = "rotate(" + angle + "deg)";
      line.width(len)
          .css({
             'transform':transform,
             "left":x,
             "top":y
          });
   }
   
   function create_line(x,y,x1,y1){
      var len = Math.sqrt((x-x1)*(x-x1) + (y-y1)*(y-y1));
      var angle = Math.atan2(y1-y,x1-x)*(180/Math.PI);
      var transform = "rotate(" + angle + "deg)";

      var line = $('<div>')
         .appendTo("#edge_display")
         .addClass('line edge')
         .css({
            "left":x,
            "top":y,
            'transform': transform
         })
         .width(len)         
      return line;
   }
   
   // domnodes are passed in.
   Model.prototype.addEdge = function(from,to){                  
      if( from === to ){return null;}
      
      var f = $(from);
      var t = $(to);
      
      var e = this.graph.addEdge(f.data("vertex"), t.data("vertex"));
      if( e === null){
         return null;
      }
      
      // +20 for the offset of the vertex divs.
      var line = create_line(f.position().left+20,
                             f.position().top +20,
                             t.position().left+20,
                             t.position().top +20);
      // add dom node edge      
      line.data("edge", e);
      line.attr("id", "edge_"+e.id);
            
      return line;
   };
   
   Model.prototype.removeVertex = function(v_){
      var v = $(v_);
      var vertex = v.data("vertex");      
                  
      vertex.edges.forEach(function(e,i,arr){
         $("#edge_"+e.id).remove();
      });             
      this.graph.removeVertex(vertex);
      v.remove();      
   };
   
   Model.prototype.removeEdge = function(e_){
      var e = $(e_);
      var edge = e.data("edge");
            
      this.graph.removeEdge(edge);
      e.remove();   
   };
   
   Model.prototype.print_adj_matrix = function(){
      // create an empty matrix
      var verts = this.graph.verts;
      var mat = new Array(verts.length);      
      this.graph.verts.forEach(function(e,i,arr){
         mat[i] = new Array(verts.length);
         for(var j=0; j < verts.length; ++j){
            mat[i][j] = 0;  
         }
      });  
      
      // fill in the matrix
      var u,v;
      
      this.graph.edges.forEach(function(e,i,arr){
         u = verts.indexOf(e.from);
         v = verts.indexOf(e.to);
         mat[u][v] = 1;
         mat[v][u] = 1;
      });
                  
      // dump to a string
      var s = this.graph.verts.length;
      s += "\n";      
      for(var i = 0; i< this.graph.verts.length; ++i){
         for( var j = 0; j < this.graph.verts.length; ++j){
            s += mat[i][j];            
            s += " ";
         }
         s +="\n";
      }
      return s;                        
   }
   
   Model.prototype.print_adj_list = function(){
      var s = this.graph.verts.length;
      s += "\n";
      
      var verts = this.graph.verts;
      this.graph.verts.forEach(function(e,i,arr){
         s += i;
         s += " ";
         s += e.edges.length;
         s += " ";
                  
         e.edges.forEach(function(e2,i2,arr2){
            if( e2.from === e){
               s += verts.indexOf(e2.to);               
            }else{
               s += verts.indexOf(e2.from);               
            }
            s += " ";            
         });
         s += "\n";         
      });      
      return s;
   }
   
   Model.prototype.print_edge_list = function(){
      var s = this.graph.verts.length;
      s += " ";
      s += this.graph.edges.length;
      s += "\n";
      
      var verts = this.graph.verts;
      this.graph.edges.forEach(function(e,i,arr){
         s += verts.indexOf(e.from);
         s += " ";
         s += verts.indexOf(e.to);
         s += "\n";         
      });
      
      return s;
   }
               
GD.Model = Model;   
})()
