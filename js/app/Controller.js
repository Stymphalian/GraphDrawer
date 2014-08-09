(function(){
   function Controller(model,view){
      this.model = model;
      this.view = view;
   };
   
   Controller.prototype.hookHandlers = function(){
      console.log("Setting up eventhandlers");
      
      // add_vertex
      var m = this.model;
      $("#add_vertex").on("click",function(){
         m.trans_state(m.StatesEnum.ADD_VERTEX);
         $("#debug_div").text("add vertex");
      });
      // remove_vertex
      $("#remove_vertex").on("click",function(){
         m.trans_state(m.StatesEnum.RM_VERTEX);
         $("#debug_div").text("remove vertex");
      });
      // add_edge
      $("#add_edge").on("click",function(){
         m.trans_state(m.StatesEnum.ADD_EDGE);
         $("#debug_div").text("add edge");
      });
      // remove_edge
      $("#remove_edge").on("click",function(){
         m.trans_state(m.StatesEnum.RM_EDGE);
         $("#debug_div").text("remove edge");
      });
      // cancel
      $("#cancel").on("click",function(){
         m.trans_state(m.StatesEnum.NONE);
         $("#debug_div").text("none");
      });
      
                     
      $("#display_div").delegate("div#edge_display .line","click",function(e){
         console.log("edge vertex");         
         if( m.current_state === m.StatesEnum.NONE){                        
            console.log("none");
         }else if( m.current_state  === m.StatesEnum.ADD_VERTEX){                        
            console.log("add vertex");
         }else if( m.current_state  === m.StatesEnum.RM_VERTEX){
            console.log("rm vertex");            
         }else if( m.current_state  === m.StatesEnum.ADD_EDGE){ 
            console.log("add edge");
         }else if( m.current_state  === m.StatesEnum.RM_EDGE){
            console.log("rm edge");
            m.removeEdge(e.target);            
         }         
      });      
      
      $("#display_div").delegate("div#vertex_display .vertex","click",function(e){
         console.log("div vertex");
         if( m.current_state === m.StatesEnum.NONE){            
            console.log("none");
         }else if( m.current_state  === m.StatesEnum.ADD_VERTEX){                        
            console.log("add vertex");
         }else if( m.current_state  === m.StatesEnum.RM_VERTEX){
            console.log("rm vertex");            
            m.removeVertex(e.target);
         }else if( m.current_state  === m.StatesEnum.ADD_EDGE){
            console.log("add edge "+ m.data.state);
            if( m.data.state === 0){
               m.data.state = 1;  
               m.data.v1 = e.target;
            }else if( m.data.state === 1){
               m.addEdge(m.data.v1,e.target);
               m.data.state = 0;
            }            
         }else if( m.current_state  === m.StatesEnum.RM_EDGE){
            console.log("rm edge");            
         }
      });
                  
      $("#display_div").on("click", function(e){                  
         if( m.current_state === m.StatesEnum.NONE){            
            //do nothing
         }else if( m.current_state  === m.StatesEnum.ADD_VERTEX){            
            // TODO:hack with -20
            m.addVertex(e.clientX-20,e.clientY-20);
         }else if( m.current_state  === m.StatesEnum.RM_VERTEX){
            //do nothing
         }else if( m.current_state  === m.StatesEnum.ADD_EDGE){
            //m.addVertex(m.data.v1,m.data.v2);
         }else if( m.current_state  === m.StatesEnum.RM_EDGE){
            //m.removeEdge(e);
         }         
      });
      
      // dump graph button
      $("#dump_graph_button").on("click",function(){         
         var val = parseInt($("#dump_graph_type")[0].value);
         var s = "";
         console.log(val);
         console.log(m.PrintEnum.ADJ_LIST);      
         console.log(m.PrintEnum.EDGE_LIST);
         console.log(m.PrintEnum.ADJ_MATRIX);         
         
         if( val === m.PrintEnum.EDGE_LIST ){
            s = m.print_edge_list();
         }else if( val === m.PrintEnum.ADJ_LIST ){
            s = m.print_adj_list();
         }else if( val === m.PrintEnum.ADJ_MATRIX ){
            s = m.print_adj_matrix();
         }         
         $("#dump_graph_textarea").text(s);         
      });   
   }

GD.Controller = Controller;   
})();

/*
// returns the coefficients of ax + by + c
function get_line(x,y,x1,y1){
   if( x1-x === 0){
      return {a:0,b:0,c:0}
   }
   
   var m = (y1 - y) / (x1 - x);
   var b = y - m*x;      
   //return [1,2,3];
   return {a:m, b:-1, c:b};
};
function line_2_line_intersect(line1,line2){
   var det = line1.a*line2.b - line1.b*line2.a;
   var x = line2.b*line1.c - line1.b*line2.c;
   var y = line1.a*line2.c - line1.c*line2.a;
   return {x:-x/det, y:-y/det};   
};

function get_line_parametric(x,y,x1,y1){      
   return{p:{x:x,y:y},d:{x:(x1-x),y:(y1-y)}};
};
function line_2_line_intersect_parametric(line1,line2){
   // line1 = p + tr
   // line2 = q + us
   // u = (q-p)xr /(rxs)
   
   var qp = {x:line2.p.x - line1.p.x, y: line2.p.y - line1.p.y};      
   var r_x_s = line1.d.x*line2.d.y - line1.d.y*line2.d.x;
   var qp_x_r = qp.x*line1.d.y - qp.y*line1.d.x;
   var u = qp_x_r/ r_x_s;
   
   console.log(qp_x_r);
   console.log(r_x_s);
   return { x: line2.p.x + u*line2.d.x, y: line2.p.y + u*line2.d.y};
};


function p2p_intersect(x1,y1,x2,y2,x3,y3,x4,y4){      
   var line1 = {a:x2-x1 ,b:-(x4-x3), c:-(x3-x1)};
   var line2 = {a:y2-y1 ,b:-(y4-y3), c:-(y3-y1)};
   var st = line_2_line_intersect(line1,line2);
   //console.log(st.x);
   //console.log(st.y);
   //st.x = Math.abs(st.x);
   //st.y = Math.abs(st.y);
         
   //console.log(!(Math.abs((y4-y3)/(x4-x3)) === Math.abs((y2-y1)/(x2-x1))) );   
   //console.log((y4-y3)/(x4-x3));
   //console.log((y2-y1)/(x2-x1));
   var rs = {
      good: ( st.x <= 1 && st.x >= 0 && st.y <= 1 && st.y >= 0),
      p:{x: x1+ st.x*(x2-x1),y: y1 + st.y*(y2-y1)}
   };   
   return rs;
}

function test(){
   var rs;
   console.log("trues----");
   rs = p2p_intersect(0,0,10,10,0,10,10,0);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
   
   rs = p2p_intersect(-10,-10,10,10,-10,10,0,0);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);   
   
   rs = p2p_intersect(-10,-10,10,10,-10,10,10,-10);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);      
         
   console.log("falses----");
   rs = p2p_intersect(0,0,10,10,15,15,30,30);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
      
   rs = p2p_intersect(0,0,10,10,0,10,2,6);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);   
   
   rs = p2p_intersect(-10,-10,10,10,-10,10,-2,2);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
   
   rs = p2p_intersect(-10,-10,10,10,2,-2,10,-10);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
   
   console.log("parallel");
   rs = p2p_intersect(0,0,10,10,0,5,15,10);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
   
   rs = p2p_intersect(0,0,10,10,0,0,10,10);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
   
   rs = p2p_intersect(0,0,10,10,5,5,15,15);
   console.log(rs.good + " " + rs.p.x + "," + rs.p.y);
}

function do_they_intersect(){      
   test();
   var x1,y1,x2,y2;
   var x3,y3,x4,y4;
   x1 = Number($("#point1_x").val());
   y1 = Number($("#point1_y").val());
   x2 = Number($("#point2_x").val());
   y2 = Number($("#point2_y").val());
      
   x3 = Number($("#point3_x").val());
   y3 = Number($("#point3_y").val());
   x4 = Number($("#point4_x").val());
   y4 = Number($("#point4_y").val());
   
   create_line(x1,y1,x2,y2);
   var rs = p2p_intersect(x1,y1,x2,y3,x3,y3,x4,y4);
   if(rs.good){
      $("#intersect_answer").text("true: " + rs.p.x + "," + rs.p.y);
   }else{
      $("#intersect_answer").text(false);         
   };
};

function create_line(x,y,x1,y1){
   var len = Math.sqrt((x-x1)*(x-x1) + (y-y1)*(y-y1));
   var angle = Math.atan2(y1-y,x1-x)*(180/Math.PI);
   var transform = "rotate(" + angle + "deg)";
   
   var line = $('<div>')
      .appendTo("#display_div")
      .addClass('line')
      .css({
         'position':'absolute',
         'transform': transform
      })
      .width(len)
      .offset({left:x,top:y});   
   return line;
}

function get_rotation_angle(tr){   
   var values = tr.split('(')[1];      
   values = values.split(',');
   
   //var a = values[0]; // 0.866025
   var b = values[1]; // 0.5
   //var c = values[2]; // -0.5
   //var d = values[3]; // 0.866025
   
   return Math.round(Math.asin(b) * (180/Math.PI));
}

function rotate_lines(){
   var angle = $("#rotate_amount").val();      
   
   //"rotate(" + toString(angle + get_rotation_angle() ) + "deg)"   
   $(".line").each(function(i){
      var a = get_rotation_angle($(this).css('transform'));
      console.log(a);
      a += Number(angle);
      console.log(a);
      var transform = "rotate(" + a + "deg)";         
      
      $(this).css({
         "-webkit-transform": transform,
         "-moz-transform": transform,
         "transform": transform
      });      
   });
   
}
*/