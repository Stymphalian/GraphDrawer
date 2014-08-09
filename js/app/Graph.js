(function(){
   function Edge(from,to,id){
      this.from = from;
      this.to = to;
      this.value = null;
      this.id = id;
   }   
   
   function Vertex(id){   
      this.value = null;
      this.edges = [];
      this.id = id;
   }
   
   function Graph(){
      this.edges = [];
      this.verts = [];
      this.next_vertex_id = 0;
      this.next_edge_id = 0;
   }
   
   Graph.prototype.addVertex = function(){
      var v = new Vertex(this.next_vertex_id++);
      this.verts.push(v);      
      return v;
   }
   
   function rm_from_array(arr,e){
      var i = arr.indexOf(e);
      if( i > -1){arr.splice(i,1);}
   }
   
   function neighbour(e,v){
      if( e.from === v){
         return e.to;
      }else if( e.to === v){
         return e.from;
      }else{
         return null;
      }      
   }
   
   Graph.prototype.removeVertex = function(v){      
      var i;
            
      // delete the vertex
      i = this.verts.indexOf(v);
      if( i <= -1){return false;} 
      this.verts.splice(i,1);
      
      // remove all the edges in the vertex's edge list.
      var u;
      v.edges.forEach(function(e,i,arr){         
         u = neighbour(e,v);            
         rm_from_array(u.edges,e);
      });
      
      // remove all the edges attached to this vertex in the graph edge list.
      for( i = this.edges.length-1; i > -1; --i){
         if( this.edges[i].from === v || this.edges[i].to === v){
            this.edges.splice(v,1);
         }
      }
      return true;
   }
   
   Graph.prototype.addEdge = function(from,to){      
      if( from === to){return null;}
      // from and to don't exist.
      if( this.verts.indexOf(from) <= -1 || this.verts.indexOf(to) <= -1){
         return null;
      }
      
      // check for duplicate edges being added.
      var found = false;
      this.edges.every(function(e,i,arr){
         if( (e.from === from && e.to === to) ||  
             (e.to === from && e.from === to))
         {
            found = true;
            return false;
         }
         return true;
      });      
      if( found === true){
         return null;  
      }
            
      // okay to add new edge
      var e = new Edge(from,to,this.next_edge_id++);      
      from.edges.push(e);
      to.edges.push(e);               
      this.edges.push(e);
      return e;      
   }
   
   Graph.prototype.removeEdge = function(e){      
      // remove the edge from the graph edge list;
      var i = this.edges.indexOf(e);
      if( i <= -1){return false;}
      this.edges.splice(i,1);
            
      // remove the edge from the vertex edge lists.
      rm_from_array(e.from.edges,e);
      rm_from_array(e.to.edges,e);
      
      return true;
   }
   Graph.prototype.numEdges = function(){
      return this.edges.length;
   }
   Graph.prototype.numVerts = function(){
      return this.verts.length;
   }
   
   // callback(edge)
   Graph.prototype.forEachEdgeOf = function(v,callback){
      v.edges.forEach(function(e,i,arr){
            callback(e);         
      });
   }
      
   // callback(neighbour)
   Graph.prototype.forEachNeighbourOf = function(v,callback){
      var u;
      v.edges.forEach(function(e,i,arr){
         u = neighbour(e,v);
         callback(u);         
      });
   }
   
   
   var test_count = 0;
   var failed_tests = [];   
   function assertEq(a,b){
      test_count++;
      if( a === b){
         return true;   
      }else{
         failed_tests.push(test_count);
         return false;
      }
      
   }
   function assertNeq(a,b){
      test_count++;
      if( a !== b){
         return true;   
      }else{
         failed_tests.push(test_count);
         return false;  
      }      
   }
   
   Graph.prototype.testGraph = function(){
      var g = new Graph();            
      var v1,v2,v3;
      var e1,e2;
      
      v3 = g.addVertex();
      assertEq(g.verts.length,1); 
      
      g.addEdge(null,v3);
      assertEq(g.edges.length, 0);
      
      g.addEdge(v3,null);
      assertEq(g.edges.length, 0);
      
      v1 = g.addVertex();
      v2 = g.addVertex();
      assertEq(g.verts.length,3);
      assertNeq(v1,null);
      assertNeq(v2,null);
      
      e1 = g.addEdge(v1,v2);
      assertEq(g.edges.length,1);
      assertEq(e1.from, v1);
      assertEq(e1.to, v2);
            
      e2 = g.addEdge(v1,v2);
      assertEq(e2,null);
      assertEq(g.edges.length,1);
      
      e2 = g.addEdge(v1,v3);
      assertNeq(e2,null);
      assertEq(g.edges.length,2);
      
      assertEq(v1.edges.length,2);
      assertEq(v2.edges.length,1);
      assertEq(v3.edges.length,1);
      assertEq(g.edges.length,2);
      assertEq(g.verts.length,3);
      
      
      g.removeVertex(v2);
      assertEq(v1.edges.length,1);      
      assertEq(v3.edges.length,1);     
      assertEq(g.edges.length,1);
      assertEq(g.verts.length,2);
            
      var v4,e4;
      v4 = g.addVertex();
      e4 = g.addEdge(v1,v4);
      
      g.removeEdge(e2);
      assertEq(v1.edges.length,1);
      assertEq(v3.edges.length,0);
            
      assertEq(v1.edges.length,1);
      //assertEq(v2.edges.length,1);
      assertEq(v3.edges.length,0);
      assertEq(v4.edges.length,1);
      assertEq(g.edges.length,1);
      assertEq(g.verts.length,3);
            
      console.log("Testing of Graph:" + failed_tests.length + "/" + test_count + " failed tests. [" + failed_tests + "]");
      g = null;
   }
   
   
GD.Edge = Edge;
GD.Vertex= Vertex;
GD.Graph = Graph;
})();