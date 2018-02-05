function factorGame(level) {

    var pageCont = document.getElementById("pageContainer");
    pageCont.style.width = Math.min(screen.height, screen.width) +"px";

    var topNum = [0];
    var forbidden  = [0,1,2,3,4,5,6,7,8,9,512, 1024, 2048, 6561, 4096, 8192];
    while (forbidden.indexOf(topNum[0]) != -1) {
        topNum[0] = Math.floor(9*Math.pow(10,level)*Math.random()+Math.pow(10,level))*Math.floor(9*Math.random()+2);    
        }
    var factorStringArray = addTimesSymbols(topNum);
    var firstLine = newNumberLine(factorStringArray);
    firstLine.style.fontSize = sizeText(factorStringArray.join(''), pageCont);
    pageCont.appendChild(firstLine);
    }


function newNumberLine (currFactors) {      //creates a new div line at the correct size, makes inputs invisible, fills in number blocks
    var newLine = document.createElement("div");
    newLine.setAttribute("class","newNumberLine");
    for (var i = 0; i<currFactors.length; i++) {
        newLine.appendChild(newBlock(currFactors[i], isPrime(Number(currFactors[i]))));
        }    
    return newLine;
    }


function isPrime(num) {
    if (num % 2 === 0 && num !== 2) {
        return false;
        }
    for (var i=3; i<=Math.floor(Math.sqrt(num)); i+=1) {
        if (num % i === 0 && num !== i) {
            return false;
            }
        }
    return true;
    }

function newBlock(num, primality) {
    var block = document.createElement("div");
    var text = document.createElement("p");
    text.setAttribute("class","numberText");
    text.innerHTML = num;
    block.appendChild(text);
    if (num !== "×" && primality === false) {
        block.setAttribute("class","compositeBlock");
        block.setAttribute("onClick","toggleInput(this)");
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("class", "hidden");
        newInput.setAttribute("onchange", "processInput(this)");
        newInput.style.width = "100px";
        newInput.style.value = "###";
        block.appendChild(newInput);
        }
    else if (num !== "×" && primality === true) {
        block.setAttribute("class","primeBlock");
        }
        else {
            block.setAttribute("class","timesBlock");
            }   
    return block;
    }

function toggleInput (clicked) {
    var visibleInputs = document.getElementsByClassName("visible");
    for (var i = 0; i < visibleInputs.length; i+=1) {    
        visibleInputs[i].setAttribute("class", "hidden");
        }
    clicked.children[1].setAttribute("class", "visible");
    clicked.children[1].focus();        
    }



function oldToggleInput(clicked){
    for (var i = 0; i < clicked.parentNode.children.length; i+=2) {
        if (clicked.parentNode.children[i].children[1].getAttribute("class") == "visible" && clicked.parentNode.children[i] !== clicked){
            clicked.parentNode.children[i].children[1].setAttribute("class", "hidden");        
            }
        }

    if (clicked.children[1].getAttribute("class") == "hidden") {
        clicked.children[1].setAttribute("class", "visible");
        clicked.children[1].focus();
        }
    }

function processInput(inputField){
    var clickedNum = Number(inputField.previousSibling.innerHTML);
    if (clickedNum % inputField.value === 0 && inputField.value >= 2 && inputField.value != clickedNum){
        var activeInputs = document.getElementsByClassName("visible");
        for (var i = 0; i < activeInputs.length; i+=1) {
            activeInputs[i].setAttribute("class", "gone");
            }

        var currFactors = [];
        var pageCont = document.getElementById("pageContainer");
        var lastNumberLine = pageCont.lastChild;       
        
        for (var j = 0; j < lastNumberLine.children.length; j+=1) {
            currFactors[j] = lastNumberLine.children[j].firstChild.innerHTML;
            if (lastNumberLine.children[j].getAttribute("class") === "compositeBlock") {
                lastNumberLine.children[j].setAttribute("onclick", "");
                }
            }
        currFactors.splice(currFactors.indexOf(inputField.previousSibling.innerHTML), 1, inputField.value, "×", clickedNum / inputField.value);                
        var newLine = newNumberLine(currFactors);
        newLine.style.fontSize = sizeText(currFactors.join(''), pageCont);
        pageCont.appendChild(newLine);
        newLine.previousSibling.setAttribute("class","oldNumberLine");
         }              

    if(checkForWin(newLine) === true) {
        newLine.setAttribute("class", "finishLine");
        }
    }


function addTimesSymbols (factorList) {
    var factorListCopy = [];
    factorListCopy[0] = factorList[0];
        for (var i = 1; i<factorList.length; i += 1) {
            factorListCopy.push("×");
            factorListCopy.push(factorList[i]);
            }
    return factorListCopy;
    }

function checkForWin(newLine) {
    var compositeBlocks = newLine.getElementsByClassName("compositeBlock");
    if (compositeBlocks.length == 0) {
        return true;
        }
    return false;
    }

function factorize(n) {         //creates array of factors
    var factors = [];
    while (grabFirstFactor(n) != null) {
        factors.push(grabFirstFactor(n));
        n=n/grabFirstFactor(n);
        }
    return factors;
    }

function grabFirstFactor(n) {       //returns lowest factor of n
    if ( n % 2 == 0 ) {
        return 2;
        }  
    for (var i=3; i <= n; i+=2) {
        if ( n % i == 0 ) {
            return i;
            }
        }
    return null;
    }


function sizeText(message, container){
    var targetSize = container.clientWidth-150;
    var innerDiv=document.createElement("div");
        innerDiv.setAttribute("id","innerDiv");
        container.appendChild(innerDiv);
        innerDiv.innerHTML = message;
    var textWidth = innerDiv.clientWidth;
    var initFS = window.getComputedStyle(innerDiv, null).getPropertyValue('font-size');
        initFS=Number(initFS.slice(0,-2));
    var i=1;    
    while (targetSize > textWidth){
        i += 1;
        innerDiv.style.fontSize=i*initFS+"px";
        textWidth = innerDiv.clientWidth;
        }  
    innerDiv.style.fontSize=(i-1)*initFS+"px"; 
    textWidth = innerDiv.clientWidth;
    var curFS = window.getComputedStyle(innerDiv, null).getPropertyValue('font-size');
        curFS=Number(curFS.slice(0,-2));
    while (targetSize >= textWidth){
        curFS+=1;
        innerDiv.style.fontSize = curFS+"px";
        textWidth = innerDiv.clientWidth;
        }
    container.removeChild(innerDiv);
    return (curFS-1)+"px";    
    }
function toggleNav() {
    if (document.getElementById("burgerNav").style.width == "250px") {
        closeNav();
        }
    else {
        openNav();
        }   
    }

function toggleSettings() {
    if (document.getElementById("settingsMenu").getAttribute("class") == "openMenu") {
        closeSettings();
        }
    else {
        openSettings();
        }   
    }

function toggleAbout() {
    if (document.getElementById("aboutMenu").getAttribute("class") == "openMenu") {
        closeAbout();
        }
    else {
        openAbout();
        }   
    }


function openSettings() {
    document.getElementById("settingsMenu").setAttribute("class", "openMenu");
    document.getElementById("closeSettingsIcon").style.display = "block"; 
    document.getElementById("burger").style.visibility = "hidden";
    }

function closeSettings() {
    document.getElementById("settingsMenu").setAttribute("class", "closedMenu");
    document.getElementById("closeSettingsIcon").style.display = "none";
    document.getElementById("burger").style.visibility = "visible";
    }

function solveIt() {
    closeSettings();
    play(currentCompositeBlocks()[0].lastChild, grabFirstFactor(currentCompositeBlocks()[0].firstChild.innerHTML));
    while (document.getElementsByClassName("finishLine").length <1) {    
        play(currentCompositeBlocks()[0].lastChild, grabFirstFactor(currentCompositeBlocks()[0].firstChild.innerHTML));
       }
    }

function play(input, num) {
    input.setAttribute("class", "visible");
    input.value = num;
    processInput(input);
}

function currentCompositeBlocks() {
    var compositeBlocks = [];
    var lastNumberLine = document.getElementsByClassName("newNumberLine")[0];
    var currNumberBlocks = lastNumberLine.children;
    for (var j = 0; j < currNumberBlocks.length; j+=1) {
            if (currNumberBlocks[j].getAttribute("class") == "compositeBlock"){
                compositeBlocks.push(currNumberBlocks[j]);
                }
        }
    return compositeBlocks;
    }

function currentCompositeNumbers() {
    var currBlocks = currentCompositeBlocks;
    var currFactors = [];
    for (var j = 0; j < currBlocks.length; j+=1) {
        currFactors.push(currNumberBlocks[j].firstChild.innerHTML);            
        }
    return currFactors;       
    }

function reloadGame() {
    var currLevel = Number(document.getElementById("levelNumber").innerHTML);
    var pageCont = document.getElementById("pageContainer");
    if (pageCont.lastChild.nodeType == 3) {
        return;
        }    
    if (pageCont.lastChild.getAttribute("class") === "newNumberLine") {
        pageCont.removeChild(pageCont.lastChild);
        }    
    var oldLines = document.getElementsByClassName('oldNumberLine');
    while(oldLines[0]) {
        oldLines[0].parentNode.removeChild(oldLines[0]);
        }
    factorGame(currLevel);
    }

function increaseLevel() {
    var currLevel = Number(document.getElementById("levelNumber").innerHTML);
    if (currLevel <= 7) {
        currLevel +=1;
        document.getElementById("levelNumber").innerHTML = currLevel;
        reloadGame();
        }
        
    }

function decreaseLevel() {
    var currLevel = Number(document.getElementById("levelNumber").innerHTML);
    if (currLevel >= 1) {
        currLevel -=1;
        document.getElementById("levelNumber").innerHTML = currLevel;
        reloadGame();
        }
    }


