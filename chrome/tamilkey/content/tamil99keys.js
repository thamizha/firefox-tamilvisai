function Tk_tamil99keyboard()
{
Tk_tamilMode = true;
Tk_isPrevConsonant = false;
Tk_isCtrl = false;
Tk_isDispatchedEvent = false;
Tk_ToggleAutodot = true;
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressTamil99);
return;
}

function Tk_handleKeyPressTamil99(evt)
{
	if(!evt.cancelable) // tamil99 char -> don't process
		return;
	else if(evt.keyCode >= 33 && evt.keyCode <= 40) // handle cursor moves
	{
		Tk_prevChar = "";
		Tk_ToggleAutodot = true;
		return;
	}
	else if(evt.keyCode == 46) // handle delete
	{
		Tk_doDel(evt);
		Tk_ToggleAutodot = true;
		return;
	}
	else if(evt.keyCode == 8 || evt.keyCode == 13 ) // handle backspace
	{
		Tk_prevChar = "";
		if(evt.keyCode == 8)
			Tk_doBS(evt);
		Tk_ToggleAutodot = true;
		return;
	}
	if (evt.charCode && Tk_tamilMode && !evt.ctrlKey)
	{
		//Case 1: current and prev key pressed are charecters

		if (evt.charCode > 255)
			return; // dont capture tamil events

		Tk_myChar = String.fromCharCode(evt.charCode);

		if(!isVowel(Tk_myChar) && !Tk_isConsonant(Tk_myChar) && !Tk_isSplChar(Tk_myChar))
		{
			Tk_isPrevConsonant = false;
			Tk_ToggleAutodot = true;
			return; //dont prevent entry of non-Tamil99 characters
		}

		if ((isVowel(Tk_myChar)) && (!Tk_isPrevConsonant))
		{
 			//Case 1.1: prev char is not consonant and current char is a vowel
			//Action: enter tamil char of current char in target
			//and set Tk_isPrevConsonant to false
			evt.preventDefault();
			Tk_inputTamil(evt, "letter");// Insert Tamil letter
			Tk_isPrevConsonant = false;
			Tk_ToggleAutodot = true;
		}//case 1.1 ends

		else if ((isVowel(Tk_myChar)) && (Tk_isPrevConsonant))
		{
			//Case 1.2: prev char is a consonant and current char is a vowel
			//Action: enter 'keetru' of current char in target, and
			//and set Tk_isPrevConsonant to false
			evt.preventDefault();
			Tk_inputTamil(evt, "keetru");// Insert keetru
			Tk_isPrevConsonant = false;
			Tk_ToggleAutodot = true;
		}//case 1.2 ends

		else if ((!isVowel(Tk_myChar)) && (!Tk_isPrevConsonant))
		{
			//Case 1.3: prev char is not consonant and current char is not vowel
			//Action: enter tamil char of current char in target,
			//set Tk_isPrevConsonant and set prev char to current char
			evt.preventDefault();
			Tk_inputTamil(evt, "letter");// Insert Tamil letter
			Tk_isPrevConsonant = Tk_isConsonant(Tk_myChar);
			Tk_prevChar = Tk_myChar;
			Tk_ToggleAutodot = true;
		}//case 1.3 ends

		else if ((!isVowel(Tk_myChar)) && (Tk_isPrevConsonant))
		{
			//Case 1.4: prev char is consonant and current char is not a vowel
			//Action: check for special condition for auto-dotting (automatic otru insertion)

			if (Tk_needAutoDot(Tk_prevChar, Tk_myChar))
			{
				//Case 1.4.1: Auto-dot needed
				//Action: Enter 'otru' and then tamil letter of evt.charCode,
				//set Tk_isPrevConsonant to true and set prev char to current char
				evt.preventDefault();
				Tk_inputTamil(evt, "auto-dot");// Insert dot and then Tamil letter
				Tk_isPrevConsonant = Tk_isConsonant(Tk_myChar);
				Tk_prevChar = Tk_myChar;
				Tk_ToggleAutodot = !Tk_ToggleAutodot;
			}//case.1.4.1 ends
			else
			{
				//Case 1.4.2: Auto-dot not needed
				//Action: enter tamil char of current char in target,
				//set Tk_isPrevConsonant and set prev char to current char
				evt.preventDefault();
				Tk_inputTamil(evt, "letter");// Insert Tamil letter
				Tk_isPrevConsonant = Tk_isConsonant(Tk_myChar);
				Tk_prevChar = Tk_myChar;
				Tk_ToggleAutodot = true;
			}// case 1.4.2 ends

		}// case 1.4 ends

	}// case 1 ends

	else
	{
		//Case 2: key pressed is non-charecter
		if(evt.keyCode==120 || evt.keyCode==8) //backspace pressed
			Tk_isPrevConsonant = false; // reset the conditional flag
	}//case 2 ends

}//end of keypress handler function


function Tk_inputTamil(e, optionString)
{

var myCode;

var editor =  (document.commandDispatcher.focusedElement instanceof
						Components.interfaces.nsIDOMNSEditableElement) ?
						document.commandDispatcher.focusedElement.editor : null
if(editor)
{
	var myField = e.target;
	var prevStr = myField.value.substring(0,myField.selectionStart);
	var postStr = myField.value.substring(myField.selectionEnd,myField.value.length);
	var len = prevStr.length ;
	var sPos = myField.selectionEnd ;
	var charAdded = myField.value.length;
	var txtTop = myField.scrollTop;
	if (e.target.type != "text" && e.target.type != "textarea" )
	{
		prevStr = myField.value;
		len = prevStr.length ;
		postStr = "";
	}
	if (optionString=="keetru")
		myField.value = prevStr + Tk_getKeetru(Tk_myChar) + postStr ;
	else if (optionString=="auto-dot")
		myField.value = prevStr + Tk_getKeetru('f') + Tk_getTamilChar(Tk_myChar) + postStr ;
	else
		myField.value = prevStr + Tk_getTamilChar(Tk_myChar) + postStr  ;
	charAdded = myField.value.length - charAdded;
	myField.scrollTop = txtTop;

	if(e.target.id != 'urlbar' )
	{
		myField.selectionStart = sPos + charAdded;
		myField.selectionEnd = sPos + charAdded;
	}
}
else
{
//case non-text type
	if (optionString=="keetru")
	{
		myCode = Tk_getKeetru(Tk_myChar).charCodeAt();
	}
	else if (optionString=="auto-dot")
	{
		var ev = window.document.createEvent("KeyEvents");
		myCode = Tk_getKeetru('f').charCodeAt();
		ev.initKeyEvent("keypress", true, false, window.document.defaultView, false, false, false, false, 0, myCode);
		e.target.dispatchEvent(ev); //Otru inserted, before inserting the char
		myCode = Tk_getTamilChar(Tk_myChar).charCodeAt();
	}
	else
	{
		myCode = Tk_getTamilChar(Tk_myChar).charCodeAt();
	}
	var evnt = window.document.createEvent("KeyEvents");
	evnt.initKeyEvent("keypress", true, false, window.document.defaultView, false, false, false, false, 0, myCode);
	e.target.dispatchEvent(evnt); // Tamil char/keetru inserted

	if (Tk_myChar=='T' || Tk_myChar=='Y')
	{
		for (i=1; i<4;i++)
		{
			myCode = Tk_getTamilChar(Tk_myChar).charCodeAt(i);
			if (myCode)
			{
				var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, false, window.document.defaultView, false, false, false, false, 0, myCode);
				e.target.dispatchEvent(evnt);
			}
		}
	}
}//case non-text type ends
}//function ends

function Tk_getTamilChar(letter)
{

var tamilChar = new Array()
//caret symbol for special purposes
tamilChar['^']="\u200C";
// upper row
tamilChar["q"]="\u0B86";
tamilChar["w"]="\u0B88";
tamilChar["e"]="\u0B8A";
tamilChar["r"]="\u0B90";
tamilChar["t"]="\u0B8F";
tamilChar["y"]="\u0BB3";
tamilChar["u"]="\u0BB1";
tamilChar["i"]="\u0BA9";
tamilChar["p"]="\u0BA3";
tamilChar["o"]="\u0B9F";
tamilChar["["]="\u0B9A";
tamilChar["]"]="\u0B9E";

tamilChar["Q"]="\u0BB8";
tamilChar["W"]="\u0BB7";
tamilChar["E"]="\u0B9C";
tamilChar["R"]="\u0BB9";
tamilChar["T"]="\u0B95\u0BCD\u0BB7";
tamilChar["Y"]="\u0BB8\u0BCD\u0BB0\u0BC0";
tamilChar["O"]="[";
tamilChar["P"]="]";

//middle row keys
tamilChar["a"]="\u0B85";
tamilChar["s"]="\u0B87";
tamilChar["d"]="\u0B89";
tamilChar["f"]="\u0B83";
tamilChar["g"]="\u0B8E";
tamilChar["h"]="\u0B95";
tamilChar["j"]="\u0BAA";
tamilChar["k"]="\u0BAE";
tamilChar["l"]="\u0BA4";
tamilChar[";"]="\u0BA8";
tamilChar["\'"]="\u0BAF";


tamilChar["A"]="\u0BF9";
tamilChar["S"]="\u0BFA";
tamilChar["D"]="\u0BF8";
tamilChar["F"]="\u0B83";
tamilChar["K"]="\"";
tamilChar["L"]=":";
tamilChar[":"]=";";
tamilChar["\""]="\'";
tamilChar["Z"]="\u0BF3";
tamilChar["X"]="\u0BF4";
tamilChar["C"]="\u0BF5";
tamilChar["V"]="\u0BF6";
tamilChar["B"]="\u0BF7";

//bottom row keys
tamilChar["z"]="\u0B94";
tamilChar["x"]="\u0B93";
tamilChar["c"]="\u0B92";
tamilChar["v"]="\u0BB5";
tamilChar["b"]="\u0B99";
tamilChar["n"]="\u0BB2";
tamilChar["m"]="\u0BB0";

tamilChar["/"]="\u0BB4";



tamilChar["M"]="/";
if(tamilChar[letter])
return tamilChar[letter];
else
return letter;

}

function Tk_getKeetru(letter) {

var keetru = new Array()
keetru["a"]="";
keetru["q"]="\u0bbe";
keetru["s"]="\u0bbf";
keetru["w"]="\u0bc0";
keetru["d"]="\u0bc1";
keetru["e"]="\u0bc2";
keetru["g"]="\u0bc6";
keetru["t"]="\u0bc7";
keetru["r"]="\u0bc8";
keetru["c"]="\u0bca";
keetru["x"]="\u0bcb";
keetru["z"]="\u0bcc";
keetru["f"]="\u0bcd";
keetru["F"]="\u0B83";
keetru['.']="."
keetru['7']="7"
keetru['8']="8"
keetru['9']="9"
keetru['0']="0"
keetru["A"]="\u0BF9";
keetru["S"]="\u0BFA";
keetru["D"]="\u0BF8";
keetru["Z"]="\u0BF3";
keetru["F"]="\u0B83";
keetru["X"]="\u0BF4";
keetru["C"]="\u0BF5";
keetru["V"]="\u0BF6";
keetru["B"]="\u0BF7";
if(Tk_prevChar == '^')
{
	keetru['.']="\u2022";
	keetru['7']="\u2018"
	keetru['8']="\u2019"
	keetru['9']="\u201c"
	keetru['0']="\u201d"
	keetru['S']="\u200c"
	keetru['C']="\u00a9";
}
return keetru[letter];
}

function isVowel(l)
{
	var vowelArray = new Array('a', 'q', 's', 'w', 'd', 'e', 'g', 't', 'r', 'c', 'x', 'z', 'f','A','S','D','F','Z','X','C','V','B','.','7','8','9','0');
	var i = 0;
	while (i<vowelArray.length)
	{
		if (l==vowelArray[i])
			return true;
		i++;
	}
	return false;
}

function Tk_isConsonant(l)
{
		var consonantArray = new Array('h', 'b', '[', ']', 'o', 'p', 'l', ';', 'j', 'k', '\'', 'm', 'n', 'v', '/', 'y', 'u', 'i', 'Q', 'W', 'E', 'R', 'T', 'Y','^');
	var i = 0;
	while (i<consonantArray.length)
	{
		if (l==consonantArray[i])
			return true;
		i++;
	}
	return false;
}

function Tk_isSplChar(l) {

var splCharArray = new Array('O', 'P', 'K', 'L', ':', '\"', 'M');
var i = 0;
while (i<splCharArray.length) {
if (l==splCharArray[i])
return true;
i++;
}
return false;
}

function Tk_needAutoDot(l1,l2)
{
	if(!Tk_ToggleAutodot)
		return Tk_ToggleAutodot;
	if (l1==l2) //same consonants
		return true;
	if ((l1=='b') && (l2=='h') ) //ngka
		return true;
	if ((l1==']') && (l2=='[') ) //njcha
		return true;
	if ((l1=='p') && (l2=='o') ) //Nda
		return true;
	if ((l1==';') && (l2=='l') ) //ntha
		return true;
	if ((l1=='k') && (l2=='j') ) //mba
		return true;
	if ((l1=='i') && (l2=='u') ) //n2Ra
		return true;
	return false;
}