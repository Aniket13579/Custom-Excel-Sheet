ls1=[];ls2=[];
var concat="";
function sizeex(){
    var rows = document.getElementById("rows").value;
    var cols = document.getElementById("cols").value;
    $.get('',{"rows":rows,"cols":cols},(done)=>{
        alert("hello");
    });
}
function below_cell(e){
    if(event.keyCode===13){
        var sp=e.split("+");
        var col=sp[0];
        var rw=parseInt(sp[1]);
        var rwnew=rw+1;
        document.getElementById(col+rwnew).focus();
    };

    if(event.keyCode==38){
        var sp=e.split("+");
        var col=sp[0];
        var rw=parseInt(sp[1]);
        var rwnew=rw-1;
        document.getElementById(col+rwnew).focus();
    };

    if(event.keyCode==40){
        var sp=e.split("+");
        var col=sp[0];
        var rw=parseInt(sp[1]);
        var rwnew=rw+1;
        document.getElementById(col+rwnew).focus();
    };

    if(event.keyCode== 39){
        var sp=e.split("+");
        var col=sp[0].charCodeAt(0);
        var colnew=String.fromCharCode(col+1);
        var rw=sp[1];
        document.getElementById(colnew+rw).focus();
    };

    if(event.keyCode== 37){
        var sp=e.split("+");
        var col=sp[0].charCodeAt(0);  //converts to ascii code
        var colnew=String.fromCharCode(col-1); //converts to char from ascii code
        var rw=sp[1];
        document.getElementById(colnew+rw).focus();
    };
    }
    var col_name = [];
    for(var i=65;i<83;i++){
        col_name.push(String.fromCharCode(i));
    }

    var flag=0;
    var selected="";
    
    //below will tell whether selected is row or column
    function isRow(e){ return isNaN(e) ? 1 : 0;}

    function selectColumn(e){
        if(flag==1) deselect(selected);
        //below code is if i select B column then it will be selected ...highlighted
        //what if i again select B column.. then the highlighted color should be remove
        //therefor if already "selected"=B and next selected "e"=B as both are equal we will deselect that row or col
        //assign "" to selected and flag will be 0 and the function should stop so return with nothing is used
        if(selected==e) {deselect(selected);selected="";flag=0;return;}
        selected = e;
        flag=1;
      
        ls1=[];concat=""
        for(var i=1;i<=30;i++){
            var data= document.getElementById(e+i);
            if(data.value!=''){
                concat+=e+i+":"+data.value+",";
                

                for(var j=65;j<83;j++){
                    var a=String.fromCharCode(j)+i;
                    //console.log(a);
                    var d1=document.getElementById(a).value; 
                    concat+=d1+",";
                    // if(d1 != ''){
                    //     concat+=d1+",";
                    // }
                }
                ls1.push(concat);
              
                concat="";
            }
            data.style.border="1px solid #0003";
            data.style.borderRight="1.3px solid #000";
            data.style.borderLeft="1.3px solid #000";
            data.style.background="rgba(144, 238, 144, 0.4)";
           
        }
        console.log(ls1)
        
    }

    function selectRow(e){
        hideMenu();
        if(flag==1) deselect(selected);
        if(selected==e) {deselect(e);selected="";flag=0;return;}
        selected = e; 
        flag=1;

        for(var i=0;i<col_name.length;i++){ 
            var data= document.getElementById(col_name[i]+e);
            if(data.value!=''){
                ls2.push(data.value);
            }
            data.style.border="1px solid #0003";
            data.style.borderTop="1.3px solid #000";
            data.style.borderBottom="1.3px solid #000";
            data.style.background="rgba(144, 238, 144, 0.4)";
           
        }
        console.log(ls2);
    }

    function deselect(e){
        hideMenu();
        if(!isRow(e)){
        console.log(e)
        for(var i=0;i<col_name.length;i++){ 
            document.getElementById(col_name[i]+e).style.borderColor="#D3D3D3";
            document.getElementById(col_name[i]+e).style.background="#fff";
            
        }
        }
        else{
        for(var i=1;i<=30;i++){
            document.getElementById(e+i).style.borderColor="#D3D3D3";
            document.getElementById(e+i).style.background="#fff";
            
        }
        }
        if(flag == 1){ 
            document.getElementById("thTag").style.disabled=true; 
        }
    }    
    //document.oncontextmenu = rightClick; //right click on anything on browser show the menu
    //document.onclick = hideMenu; //normal click on anything close the menu

    function rightClick(e){
        e.preventDefault(); //prevent default browser right click which contains inspect etc 
        var Menu = document.getElementById("Menu"); 
        var select = document.getElementById(selected);
        console.log(selected);
        if(selected=="") {alert("Please select row or column");return;} //if row or column is selected then only shown menu
        if(Menu.style.display =="block"){ //if menu is displayed hide the menu on click
            hideMenu();
        }
        else{
            Menu.style.display="block"; //display the menu
            Menu.style.background="#000"; 
            Menu.style.zIndex="1000"; //comes to top layer above all the div
            console.log(Menu.style.display);
            if(e.pageX>1000) Menu.style.left = e.pageX-150 + "px"; //if the right clicked menu is displaying outside the screen
            else Menu.style.left = e.pageX + "px";
            if(e.pageY>500) Menu.style.top = e.pageY-80 + "px"; //if the right clicked menu is displayinh bottom the screen
            else Menu.style.top = e.pageY + "px";
            console.log(Menu.style.top)
        }
    }

    function hideMenu(){
        document.getElementById("Menu").style.display="none"; //dont display menu on click anywhere
    }

    function rm_select(){
        hideMenu();
        deselect(selected);
    }

    function sort(e){
        var choice=e;
        console.log(choice);
        console.log(ls1);
        $.get('/sorting',{"choice":choice,"array":JSON.stringify(ls1)},(data)=>{
            var data=JSON.parse(data)
            var timer_so=data['timer'];
            document.getElementById('time_so').innerHTML=e+" sort was done in "+timer_so+" seconds";
           console.log("TIME"+timer_so);
           delete data['timer']; 
            
            var pos = selected.charCodeAt(0)-65        
             for(var i=1; i<=30;i++){
                var change=document.getElementById(selected+i);
                if(change.value!=""){
                    var otherData=0;
                    for(var m=65;m<83;++m){
                        if(selected+i in data){
                            console.log(data[selected+i][otherData]);
                            document.getElementById(String.fromCharCode(m)+i).value=data[selected+i][otherData]
                            otherData+=1
                        }  
                    }
                    change.value=data[selected+i][pos]
                }
            }
            ls1=[];concat="";
        });
        concat="";
        ls1=[];
    }

    function search(e){
        hideMenu();
        var modal = document.getElementById("myModal");
        
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block"; 
        
        span.onclick = function() {
            modal.style.display = "none";
            all_change();
          }
          
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
              all_change();
            }
          }
    }

    var choice_s;
    function setChoice(e){
        choice_s=e;
    }

    function all_change() {
        for(var i=65;i<83;++i){//all cols 
            for(var j=1;j<=30;++j){
                document.getElementById(String.fromCharCode(i)+j).style.backgroundColor="#fff";
                document.getElementById(String.fromCharCode(i)+j).style.color="#000";
            }        
        }
    }

    function search2(){
        all_change(); 
        var searchElement=document.getElementById("search_elem").value;
        var choice=choice_s;
        console.log(searchElement)
        console.log(choice);
        all_values={};
        for(var i=65;i<83;++i){//all cols 
            var list_values=[]
            allp=String.fromCharCode(i) //A,B,C
            for(var j=1;j<=30;++j){
                if(document.getElementById(allp+j).value!='')
                    list_values.push(document.getElementById(allp+j).value);
            }
            //final dictionary
            all_values[allp] = list_values;            
        }

        $.get('/searching',{"choice":choice,"array_s":JSON.stringify(all_values),"val_s":searchElement},(data)=>{
           console.log(data);
            var context=JSON.parse(data)
            pos=context['pos'];timer=context['timer']
            document.getElementById("time_s").innerHTML="<h3>Element was searched in "+timer+" seconds";
            if(pos!="Element not found!"){
                document.getElementById(pos).style.backgroundColor="#000";
                document.getElementById(pos).style.color="#fff";
            }
            else{
                alert(pos);
            }
        });        
        choice="";
    }


    function checkDist(e){
        var ans = document.getElementById(e).value;
        $.get('/dictionary',{"val":ans},(data)=>{
            if(data!=""){
                document.getElementById(e).style.textDecoration="underline";
                document.getElementById('time_so').innerHTML="Matched source: "+data;
                setTimeout(()=>{
                    document.getElementById(e).value=data; 
                },2000);
            }
         });        
    }
