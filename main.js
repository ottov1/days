// main logic

var mdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var mnames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var mcodes = new Array(6, 2, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4);
var day, month, year, leap, mday;
var centurycode, yearcode, monthcode, daycode, leapadj;
var flyingout = 0;

var firefox = navigator.userAgent.toLowerCase().indexOf("firefox/");
var chrome = navigator.userAgent.toLowerCase().indexOf("chrome/");
var browserok = firefox > 0 || chrome > 0 || navigator.userAgent.toLowerCase().indexOf("webkit") > 0;

function randomday()
{
    year = (Math.floor(Math.random()*3) + 18) * 100 + Math.floor(Math.random()*100);
    month = Math.floor(Math.random()*12);
    day = Math.floor(Math.random()*mdays[month])+1;
    setdate(day, month, year);
}

function setdate(d, m, y, calc)
{
    year = y; month = m; day = d;
	
    if (year < 1800) year = 1800;
    else if (year > 2099) year = 2099;
	
    if (month < 0) month = 0;
    else if (month > 11) month = 11;
		
    leap = year % 4 == 0 && year != 1800 && year != 1900;
    mday = mdays[month];
	
    if (day < 1) day = 1;
    else if (day > mday) day = mday;
	
    $("#day").html(day);
    $("#month").html(mnames[month]);
    $("#year").html(year);
	
    if (calc)
    {
	answer = calcday();
	$('.dow').removeClass("correct");
	$('.dow[day="'+answer+'"]').addClass("correct");
	$(".next").addClass("shownext");
    }
}

function calcday()
{
    centurycode = 0;
    if (year >= 1900 && year < 2000)
	centurycode = 1;
    else if (year >= 1800 && year < 1900)
	centurycode = 3;
    
    yearcode = (year % 100) % 28;
    if (yearcode >= 24)
	yearcode = 2 + yearcode - 24;
    else if (yearcode >= 20)
	yearcode = 4 + yearcode - 20;
    else if (yearcode >= 16)
	yearcode = 6 + yearcode - 16;
    else if (yearcode >= 12)
	yearcode = 1 + yearcode - 12;
    else if (yearcode >= 8)
	yearcode = 3 + yearcode - 8;
    else if (yearcode >= 4)
	yearcode = 5 + yearcode - 4;
    else
	yearcode = 0 + yearcode - 0;
    
    monthcode = mcodes[month];
    
    daycode = day % 7;
    
    if (leap && month < 2)
	leapadj = -1;
    else
	leapadj = 0;
	
    return (centurycode + yearcode + monthcode + daycode + leapadj) % 7;
}

function change(elem)
{
    $("#"+elem).addClass("offscreen");
    setTimeout(function(){ 
	$("#"+elem).removeClass("offscreen"); 
	flyingout=0; 
    }, 1200 );
}

function settoday()
{
    setdate((new Date()).getDate(), (new Date()).getMonth(), (new Date()).getFullYear(), true);
}

function flyout(callback)
{
    if (flyingout)
	return;
    flyingout = 1;
    if (!browserok)
    {
	$("#day").html("--"); $("#month").html("--"); $("#year").html("----");
    } 
    $(".dow").addClass("disabled");
    setTimeout(function(){ change("day"); }, Math.floor(Math.random()*250));
    setTimeout(function(){ change("month"); }, Math.floor(Math.random()*250));
    setTimeout(function(){ change("year"); }, Math.floor(Math.random()*250));
    setTimeout(function(){ change("comma"); }, Math.floor(Math.random()*250));
    
    setTimeout(function() { $(".next").removeClass("shownext"); }, 500);
    setTimeout(function() { 
	$(".dow").removeClass("disabled"); 
	$(".next").removeClass("hidenext");
	callback(); }, 600);
}

function dayclicked(dow)
{
    if (flyingout)
	return;
    answer = $(dow).attr("day");
    correctanswer = calcday();
    $('.dow[day="'+correctanswer+'"]').removeClass("correct2").addClass("correct");
    $('.dow').removeClass("wrong");
    if (correctanswer == answer)
	$("#result").html("Correct");
    else
    {
	$("#result").html("Wrong");
	$('.dow[day="'+answer+'"]').addClass("wrong");
    }
    $(".next").addClass("shownext");
}

$(document).ready(function() {
    setTimeout(function(){flyout(randomday);}, 500);
    
    $(".dow").click(function(event){
	dayclicked(event.target);
    });
    
    $(".next").click(function(event){
	$('.dow').removeClass("wrong").removeClass("correct").removeClass("correct2");
	$(".next").addClass("hidenext");
	flyout(randomday);
    });
	
    $("#day").mousewheel(function(event, delta){
	day = day + Math.floor(delta);
	setdate(day, month, year, true);
    });
    $("#day").click(function(event){
	flyout(settoday);
    });
	
    $("#month").mousewheel(function(event, delta){
	month = month + Math.floor(delta);
	setdate(day, month, year, true);
    });
    $("#month").click(function(event){
	flyout(settoday);
    });

    $("#year").mousewheel(function(event, delta){
	year = year + Math.floor(delta);
	setdate(day, month, year, true);
    });
    $("#year").click(function(event){
	flyout(settoday);
    });
    
    $("#about").click(function(){
	window.scrollTo(0, 1);
	$(".help").css("display", "block");
	setTimeout(function(){$(".help").addClass("helpvis");}, 100);
    });
    
    $(".help").click(function(){
	$(".help").removeClass("helpvis");
	setTimeout(function(){$(".help").css("display", "none");}, 500);
    });
    
    $(document).keypress(function(event){
	if (event.which == 32)
	    $(".next").click();
	else if (event.which >= 48 && event.which <=54)
	    dayclicked($('.dow[day="'+(event.which-48)+'"]'));
    });
    
    $("#feedback a").attr("href", "mailto:l"+"o"+"s"+"h"+"i"+"a"+"@"+"g"+"m"+"a"+"i"+"l"+".com");
    
    setTimeout(function(){ window.scrollTo(0, 1); }, 100);
});
