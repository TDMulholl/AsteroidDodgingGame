

/*eslint-env browser*/
/*exported dropDownListAppearance,dropDownListHover*/

var menuBarElements = document.querySelectorAll(".selectedMenuButton,.menuButton");

for (var i = 0; i < menuBarElements.length; i++) 
{
    var specificElementInner = menuBarElements[i].innerHTML;
    
    menuBarElements[i].setAttribute('onmouseover', "dropDownListAppearance('" + specificElementInner + "', 'True');");
    
    menuBarElements[i].setAttribute('onmouseout', "dropDownListAppearance('" + specificElementInner + "', 'False');");
}
 
function dropDownListAppearance(menuBarElementInner, isVisible) 
{
    var selectedTD
    
    if (menuBarElementInner == 'Assignments')
    {
        selectedTD = document.querySelector(".assignmentDrop");
    }
    else if (menuBarElementInner == 'Online Learning')
    {
        selectedTD = document.querySelector(".onlineLearningDrop");
    }
    
    try {
        if (isVisible == 'True') 
        {
            selectedTD.style.display = "block";
        }
        else 
        {
            selectedTD.style.display = "none";
        } 
    } catch (TypeError){ 
        // Error Caught 
    }
    
        
}

function dropDownListHover(menuBarElementInner, isVisible) 
{
    var selectedTH 
    var selectedTD
    
    if (menuBarElementInner == 'Assignments')
    {
        selectedTH = menuBarElements[1];
        selectedTD = document.querySelector(".assignmentDrop");
    }
    else if (menuBarElementInner == 'Online Learning') 
    {
        selectedTH = menuBarElements[3];
        selectedTD = document.querySelector(".onlineLearningDrop");
    }
    
    if (isVisible == 'True') 
    {
        selectedTD.style.display = "block";
        Object.assign(selectedTH.style,{backgroundColor:"#382B68",color: "#D3FFF9",transform:"scale(1.4, 1.4)",border:"2px solid #D3FFF9",position:"static",marginTop:"-5px",transitionDuration:"0.3s"});
    }
    else 
    {
        selectedTD.style.display = "none";
        Object.assign(selectedTH.style,{backgroundColor:"",color: "",transform:"",border:"",position:"",marginTop:"",transitionDuration:""});
    }
        
}

