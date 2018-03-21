$(window).ready(function() {

//add events
$("#enterCover").click(function()  {submit();});
$(".numButton").click(function() {typeNumber($(this));});
$("#clearCover").click(function() {clear();});
$("#burgerCover").click(function() {openSettings();});
$("#closeSettingsCover").click(function() {closeSettings();});
$("#reloadCover").click(function() {reloadGame();});
$("#levelDecreaseButton").click(function() {decreaseLevel();});
$("#levelIncreaseButton").click(function() {increaseLevel();});
$("#showSolution").click(function() {solveIt();});
$("#numPadarrowBar").click(function(){toggleNumPad(); $("#arrowImage").toggleClass("arrowOpen arrowClosed")});
$("#levelSlider").attr("max", 1);
$("#levelSlider").val(1);
$("#levelSlider").change(function() {reloadGame();});
$("#levelLi").addClass("disabled");
//$("#levelLi").addClass("greyed");
$("#digitSlider").attr("max", 8);
$("#digitSlider").attr("min", 2);
$("#digitSlider").val(2);
$("#digitSlider").change(function() {reloadGame();});
$("#messageContainer").css("display", "none");
$("#messageContainer").bind('oanimationend animationend webkitAnimationEnd', function() { 
   messageOff(); 
});

primes = primesBelow(100000);

primeDigits = {
    1:2,
    2:11,
    3:101,
    4:1009,
    5:10007,
    6:100003,
    7:1000003,
    8:10000019
    }

primeDigitsIndex = {
    2:0,
    11:4,
    101:25,
    1009:168,
    10007:1229,
    1000003:9592,
    10000003:78498,
    100000019:664579
    }

});

window.onload = function(){placeNewLine([getSeed()])};

function reloadGame() {
    $("#gameContainer").children('.line').remove();
    $("#levelSlider").attr("max", Math.floor(Number($("#digitSlider").val())/2));
    if (Number($("#digitSlider").val())/2 >= 2) {
        $("#levelLi").removeClass("disabled");
        }
    placeNewLine([getSeed()]);
    }

function typeNumber(button) {
    $("#numPadInput").val($("#numPadInput").val()+$(button).html());
    }

function submit() {
    play(Number($("#numPadInput").val()));
    }

function placeNewLine(arr) {
    var newl = createLineObject(arr);
    $("#gameContainer").append($(newl));
    if ($("#numPad").hasClass("numPadOpen")) {
        $(".new.line").find(".compositeBlock").first().addClass("clicked");
        if ($(".line").length > 1) {
            $(".new.line").find(".compositeBlock").first().find(".circle").removeClass("gone");
            }
        }
    $(newl).find(".numberText").css("font-size", sizeText($(newl), $("#gameContainer").width())+"vmin");
          if (checkForWin() === true) {  
                win();                     
                }
    if ($(".line").length > 1) {
        window.scrollTo(0,document.querySelector("#gameContainer").scrollHeight); 
        }
    }

function getSeed() {
    var l = $("#levelSlider").val();
    var d = $("#digitSlider").val();
    var factors = []
    var prod = 1;
    var newP = 1;
    while (Math.log10(prod) < d-1) {
            newP = getPrime(l);//get a new prime with the right number of digits            
            factors.push(newP);
            prod *= newP;
    }
    return prod;
}

function prod(arr) {
    var k = 1;
    for (i in arr) {
        k *= arr[i];
        }
    return k; 
}

function primesBelow(n) {
    var sieve = new Array(n);
    var primes = [];
    for (var test = 2; test < n; ++test) {
        if (sieve[test]) {
            // NOT PRIME
            }
        else {
            primes.push(test);
            for (var pm = test; pm < n; pm += test)
                sieve[pm] = true;
            }
        }
    return primes;
}

    

function getPrime(d) { //gets a random prime with a certain number of digits
    var maxIndex = primeDigitsIndex[primeDigits[Number(d)+1]];  
    var minIndex = primeDigitsIndex[primeDigits[Number(d)]];
    var newPrimeIndex = Math.floor(Math.random() * (maxIndex-minIndex)) + minIndex;
    return primes[newPrimeIndex];
    }


function play() {
    if($(".clicked").length > 0){
        var num = Number($("#numPadInput").val());
        $("#numPadInput").val("");
        var dividend = Number($(".clicked").find(".numberText").text());
        if (dividend % num === 0 && num >= 2 && num !== dividend) {
            var blockIndex = Number($(".clicked").attr("id").split("num")[1]);
            $(".clicked").removeClass("clicked");
            var arr = [];
            $(".new").find(".numberText").each(function() {arr.push($(this).text())});
            $(".entryInput").addClass("hidden");
            $(".new").addClass("old").removeClass("new");
            arr.splice(blockIndex, 1 , num, "×", dividend / num);
            $(".clicked").removeClass("clicked");
            $(".circle").addClass("gone");
            placeNewLine(arr);
        }
    }
}

function win() {
    closeNumPad();
    closeArrow();
    createEndLine();
    }

function createEndLine() {
    var arr=[];
    $(".line").last().find(".primeBlock").find(".numberText").each(function() {arr.push(Number($(this).text()))});
    var counts = {};
    var uniFactors = [];
    var finishText = "";
    var prod = 1;
    arr.forEach(function(x) {
             counts[x] = (counts[x] || 0)+1;
             prod *= parseInt(x);
             if (uniFactors.indexOf(x) == -1) {
                uniFactors.push(x);
                }          
             });
    uniFactors.sort();
    finishText = prod + " = ";
    uniFactors.forEach(function(y) {
        finishText += ("" + y + String(counts[y]).sup());
        });
    var winDiv = $("<div id = 'winLine'><p id='winText'>" + finishText + "</p></div>");
    $(winDiv).addClass("line");
    $("#gameContainer").append(winDiv);
    $("#winText").css("font-size", sizeText(winDiv, $("#gameContainer").width())+"vmin");
    $("#winText").addClass("numberText");
    }

function checkForWin() {
    if ($(".new").find(".compositeBlock").length === 0) {
        return true;
        }
    return false;
}

function factorCount(num) {
    remainder = num;
    i = 1;
    while (isPrime(remainder) === false) {
        remainder = remainder / getFirstFactor(remainder);
        i++;}
    return i;
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

function createLineObject(arr){
    $(".old").find(".compositeBlock").off("click");
    var newLineIndex = (arr.length - 1) / 2;
    var div = $("<div></div>");
    div.addClass("new").addClass("line");
    div.attr("id", "line" + newLineIndex);
    for (t in arr) {
        b = createNumberBlockObject(arr[t]);
        if (t !== "×") {
            b.attr("id", div.attr("id") + "num" + t);
        }
        b.appendTo(div);
    }
    return div;
}

function clear(){
    $("#numPadInput").val("");
    }


function createNumberBlockObject(num) {
    var div = $("<div></div>");
    $("<p class = 'numberText'>" + num + "</p>").appendTo(div);
    if (num == "×") {
        div.attr("class","timesBlock")
        }
    else {
        if (isPrime(Number(num)) === true) {
            div.addClass("primeBlock");
            }            
        else {
            div.addClass("compositeBlock");
            div.append('<svg height="2vw" width="2vw"><circle class = "circle gone" cx="1vw" cy="1vw" r="1vw" fill="black" /></svg>');
            div.click(function() {
                $(".line").find(".clicked").removeClass("clicked");
                $(this).addClass("clicked");
                $(".circle").addClass("gone");
                $(this).find(".circle").removeClass("gone");
                if ($("#numPad").hasClass("numPadClosed")) {
                    $("#numPad").toggleClass("numPadClosed numPadOpen");
                    $("#arrowImage").toggleClass("arrowOpen arrowClosed");
                    }                             
                });
            }
        }    
    return div   
}

function sizeText(message, cwidth) {
    var f = 1;
    while ($(message).css("font-size", f +"vmin").width() < cwidth) {
        f+=10;
        }
    f-=10;
    while ($(message).css("font-size", f +"vmin").width() < cwidth) {
        f++;
        }
    f--;
    while ($(message).css("font-size", f +"vmin").width() < cwidth) {
        f+=0.1;
        }
    f-=0.1;
    while ($(message).css("font-size", f +"vmin").width() < cwidth) {
        f+=0.01;
        }
    f-=0.01;
    f=Math.round(100*(f))/100;
    $(message).css("font-size", "");
    return f;
    }

function toggleSettings() {
    $("#settingsMenu").toggleClass("closed open");
    $("#burger").toggleClass("closed open");
    $("#closeSettingsIcon").toggleClass("closed open");
    $("#reloadButton").toggleClass("closed open");
    }

function increaseLevel() {
    var currentLevel = Number($("#levelNumber").html());
    if (currentLevel < 10) {
        $("#levelNumber").html(1+currentLevel);
        }
    }

function decreaseLevel() {
    var currentLevel = Number($("#levelNumber").html());
    if (currentLevel > 1) {
        $("#levelNumber").html(-1+currentLevel);
        }
    }

function openSettings() {
    $("#settingsMenu").toggleClass("closed open");
    $("#burger").toggleClass("closed open");
    $("#closeSettingsIcon").toggleClass("closed open");
    $("#reloadButton").toggleClass("closed open");
    }

function closeSettings() {
    $("#settingsMenu").toggleClass("closed open");
    $("#burger").toggleClass("closed open");
    $("#closeSettingsIcon").toggleClass("closed open");
    $("#reloadButton").toggleClass("closed open");
    }


function factorize(n) {         //creates array of factors
    var factors = [];
    while (grabFirstFactor(n) != null) {
        factors.push(grabFirstFactor(n));
        n=n/grabFirstFactor(n);
        }
    return factors;
    }

function solveIt() {
    closeSettings(); 
    var i = 0;
    while (checkForWin() !== true) {
        $(".clicked").removeClass("clicked");
        var firstCompositeBlock = $(".new.line").find(".compositeBlock").first();
        firstCompositeBlock.addClass("clicked");
        $("#numPadInput").val(grabFirstFactor(Number($(firstCompositeBlock).find(".numberText").text())));
        play();
        }
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

function messageOn() {
    $("#pageContainer").addClass("dim");
    $("#messageContainer").css("display", "block");
    }

function messageOff() {
    $("#pageContainer").removeClass("dim");   
    $("#messageContainer").css("display", "none");
    } 

function messageText(t) {
    $("#messageText").text(t);
    }

function fadeMessage() {
    $("#messageContainer").addClass("animate-flicker");
    }

function displayMessage(t) {
    messageText(t);
    messageOn();
    fadeMessage();
    }
function toggleNumPad() {
    $("#numPad").toggleClass("numPadClosed numPadOpen");
    }

function closeNumPad() {
    $("#numPad").removeClass("numPadOpen").addClass("numPadClosed");
    }
function openNumPad() {
    $("#numPad").addClass("numPadOpen").removeClass("numPadClosed");
    }

function toggleArrow() {
    $("#arrowImage").toggleClass("arrowOpen arrowClosed");
    }

function openArrow() {
    $("#arrowImage").addClass("arrowOpen").removeClass("arrowClosed");
    }

function closeArrow() {
    $("#arrowImage").removeClass("arrowOpen").addClass("arrowClosed");
    }
