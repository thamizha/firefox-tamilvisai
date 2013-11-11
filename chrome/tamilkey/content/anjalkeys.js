var Tk_prevPrevChar = "";
var Tk_cursorPos = 1;
function Tk_anjalkeyboard()
{
	Tk_tamilMode = true;
	Tk_isPrevVowel = false;
	Tk_isPrevConsonant = false;
	Tk_isKeetruCondition = false;
	Tk_isCtrl = false;
	Tk_prevChar = "";
	Tk_ConverterLib.toggleEditor(Tk_handleKeyPressAnjal)
	return;
}

function Tk_handleKeyPressAnjal(evt)
{
	if(!evt.cancelable) // anjal char -> don't process
		return;
	if(evt.keyCode >= 33 && evt.keyCode <= 40) // handle cursor moves
	{
		Tk_isPrevConsonant = false;
		Tk_isPrevVowel = false;
		Tk_isKeetruCondition = false;
		return;
	}
	else if(evt.keyCode == 46) // handle delete
	{
		Tk_doDel(evt);
		return;
	}
	else if(evt.keyCode == 8 || evt.keyCode == 13 ) // handle backspace and enter key
	{
		if(evt.keyCode == 8)
			Tk_doBS(evt);
		else
		{
			Tk_cursorPos = 1;
			Tk_isPrevConsonant = false;
			Tk_isPrevVowel = false;
			Tk_isKeetruCondition = false;
			Tk_prevChar = "";
		}
		return;
	}
	else if(evt.charCode == 32)
	{
		Tk_isPrevConsonant = false;
		Tk_isPrevVowel = false;
		Tk_isKeetruCondition = false;
		Tk_prevPrevChar = Tk_prevChar;
		Tk_prevChar = " ";
	}

	if (evt.charCode && Tk_tamilMode && !evt.ctrlKey)
	{
	//Case 1: key pressed is character, mode is tamil and not a control sequence
		if (evt.charCode > 255)
			return; // dont capture tamil events
		Tk_myChar = String.fromCharCode(evt.charCode);

		if(!Tk_isVowelAnjal(Tk_myChar) && !Tk_isConsonantAnjal(Tk_myChar))
		{
			Tk_isPrevConsonant = false;
			Tk_isPrevVowel = false;
			Tk_isKeetruCondition = false;
			return; //dont handle non-Anjal characters
		}
		if (Tk_isVowelAnjal(Tk_myChar))
		{
			//Case 1.1: char is a vowel
			if (Tk_isPrevVowel)
			{
				//Case 1.1.1 prev char is vowel
				if (Tk_isKeetruCondition)
				{
					//case 1.1.1.1 keetru condition is true
					if (Tk_prevChar==Tk_myChar)
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "nedil-keetru"); //change kuRil keetru to nedil keetru
					}
					else if (Tk_isComplexChar(Tk_prevChar.concat(Tk_myChar)))
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "complex-keetru"); //'ai' or 'au' keetrus
					}
					else
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "letter") // enter the letter
					}
					Tk_isKeetruCondition = false;
				}//case 1.1.1.1 ends
				else
				{
					//case 1.1.1.2: not keetru condition
					if (Tk_prevChar==Tk_myChar)
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "nedil-letter"); //change kuril letter to nedil letter
					}
					else if (Tk_isComplexChar(Tk_prevChar.concat(Tk_myChar)))
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "complex-letter"); // 'ai' or 'au' letters
					}
					else
					{
						evt.preventDefault();
						Tk_inputAnjal(evt, "letter"); //enter the letter
					}
				}//case 1.1.1.2 ends
				Tk_isPrevConsonant = false;
				Tk_isPrevVowel = false;
				Tk_isKeetruCondition = false;
			}//case 1.1.1 ends
			else if (Tk_isPrevConsonant)
			{
				//Case 1.1.2 prev char is Consonant
				evt.preventDefault();
				Tk_inputAnjal(evt, "keetru"); // enter keetru
				if (Tk_isNedil(Tk_myChar))
				{
					isKeetruCondition = false;
					isPrevVowel = false;
				}
				else
					Tk_isPrevVowel = true;
				Tk_isPrevConsonant = false;
			}//case 1.1.2 ends
			else
			{
				//Case 1.1.3 prev char is not alphabet
				evt.preventDefault();
				Tk_inputAnjal(evt, "letter"); //enter the letter
				Tk_isPrevVowel = true;
				Tk_isPrevConsonant = false;
			}//case 1.1.3 ends
			Tk_prevChar = Tk_myChar;
		}//Case1.1 ends
		else
		{
			//Case 1.2: char is a consonant
			if (Tk_isPrevConsonant)
			{
				//Case 1.2.1 prev char is consonant
				if (Tk_isComplexChar(Tk_prevChar.concat(Tk_myChar)))
				{
					evt.preventDefault();
					Tk_inputAnjal(evt, "complex-letter"); //enter complex letter
				}
				else
				{	//not complex char
					evt.preventDefault();
					Tk_inputAnjal(evt, "letter"); //enter the letter
				}
			}//case 1.2.1 ends
			else
			{
				//case 1.2.2: prev char is not consonant
				evt.preventDefault();
				Tk_inputAnjal(evt, "letter"); //enter the letter
			}
			Tk_prevChar = Tk_myChar;
			Tk_isKeetruCondition = true;
			Tk_isPrevConsonant = true;
			Tk_isPrevVowel = false;
		}//case 1.2 ends
	}// case 1 ends
	else
	{
		//Case 2: key pressed is non-charecter
		if(evt.keyCode==120)
		{
			Tk_isPrevConsonant = false;
			Tk_isPrevVowel = false;
			Tk_isKeetruCondition = false;
		}
	}//case 2 ends
	Tk_cursorPos = 0;
}//end of keypress handler function


function Tk_inputAnjal(e, optionString)
{
	var editor =  (document.commandDispatcher.focusedElement instanceof
						Components.interfaces.nsIDOMNSEditableElement) ?
						document.commandDispatcher.focusedElement.editor : null
	if(editor)
	{
		//case: text type
		var myField = e.target;
		var prevStr = myField.value.substring(0,myField.selectionStart);
		if( Tk_prevPrevChar == 'n' && Tk_prevChar == 't' && Tk_myChar=='h') // delete 'n' before inserting 'nth'
			prevStr = prevStr.substring(0,prevStr.length - 2);
		var postStr = myField.value.substring(myField.selectionEnd,myField.value.length);
		var len = prevStr.length ;
		var sPos = myField.selectionEnd ;
		var charAdded = myField.value.length;
		var txtTop = myField.scrollTop;
		if (e.target.type != "text" && e.target.type != "textarea")
		{
			prevStr = myField.value;
			len = prevStr.length ;
			postStr = "";
		}
		if (optionString=="keetru")
		{
			len --;
			myField.value = prevStr.substring(0,len) + Tk_getKeetruAnjal(Tk_myChar) + postStr;
		}
		else if (optionString=="nedil-keetru")
		{
			if (Tk_myChar!='a')
				len --
			myField.value = prevStr.substring(0,len)  + Tk_getKeetruAnjal(Tk_myChar.toUpperCase()) + postStr;
		}
		else if (optionString=="complex-keetru")
		{
			myField.value = prevStr + Tk_getKeetruAnjal(Tk_prevChar.concat(Tk_myChar)) + postStr;
		}
		else if (optionString=="nedil-letter")
		{
			len--;
			myField.value = prevStr.substr(0,len) + Tk_getAnjalChar(Tk_myChar.toUpperCase()) + postStr;
		}
		else if (optionString=="complex-letter")
		{
			len--;
			if (Tk_isPrevConsonant)
				len--;
			myField.value = prevStr.substr(0,len) + Tk_getAnjalChar(Tk_prevChar.concat(Tk_myChar)) + postStr;
		}
		else
			myField.value = prevStr + Tk_getAnjalChar(Tk_myChar) + postStr;
		charAdded = myField.value.length - charAdded;
		myField.scrollTop = txtTop;
		if(e.target.id != 'urlbar' )
		{
			myField.selectionStart = sPos + charAdded;
			myField.selectionEnd = sPos + charAdded;
		}
	}//case: 'text' type ends
	else
	{ //case: non-text type
		var myChar;
		if (optionString=="keetru")
		{
			var ev = document.createEvent("KeyEvents");
			ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
			e.target.dispatchEvent(ev); //insert backspace to remove 'otru'
			myChar = Tk_getKeetruAnjal(Tk_myChar); //char of keetru
		}
		else if (optionString=="nedil-keetru")
		{
			if (Tk_myChar!='a')
			{ // 'a' has no visible kuRil
				var ev = document.createEvent("KeyEvents");
					ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
				e.target.dispatchEvent(ev); //insert backspace to remove kuRil keetru
			}
			myChar = Tk_getKeetruAnjal(Tk_myChar.toUpperCase()); //char of nedil keetru
		}
		else if (optionString=="complex-keetru")
		{
			myChar = Tk_getKeetruAnjal(Tk_prevChar.concat(Tk_myChar)); //char of complex keetru
		}
		else if (optionString=="nedil-letter")
		{
			var ev = document.createEvent("KeyEvents");
				ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
			e.target.dispatchEvent(ev); //insert backspace to remove kuRil letter
			myChar = Tk_getAnjalChar(Tk_myChar.toUpperCase()); //char of nedil letter
		}
		else if (optionString=="complex-letter")
		{
			var ev = document.createEvent("KeyEvents");
				ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
			e.target.dispatchEvent(ev); //insert backspace to remove prev letter
			if (Tk_isPrevConsonant)
			{ //insert another backspace (otru + letter)
				var ev = document.createEvent("KeyEvents");
					ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
				e.target.dispatchEvent(ev);
			}
			myChar = Tk_getAnjalChar(Tk_prevChar.concat(Tk_myChar)); //char of complex letter
		}
		else
		{
			myChar = Tk_getAnjalChar(Tk_myChar); //code of letter
		}//all options checked and appropriate charCode assigned

		if( Tk_prevPrevChar == 'n' && Tk_prevChar == 't' && Tk_myChar=='h') // delete 'n' and inserting 'nth'
		{
			var ev = document.createEvent("KeyEvents");
				ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
			e.target.dispatchEvent(ev); //insert backspace to remove prev letter

			var ev = document.createEvent("KeyEvents");
				ev.initKeyEvent("keypress", true, true, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 8, 0);
			e.target.dispatchEvent(ev); //insert backspace to remove prev letter
		}
		var i = 0
		while(i < myChar.length)
		{
			var myCode = myChar.charCodeAt(i);
			var evnt = document.createEvent("KeyEvents");
				evnt.initKeyEvent("keypress", true, false, document.defaultView, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, myCode);
			e.target.dispatchEvent(evnt); // Intended letter inserted
			i++;
		}

	}//case: non-text type ends
	Tk_prevPrevChar = Tk_prevChar;
}//function ends

function Tk_getAnjalChar(letter)
{
	var anjCh = new Array()
if((Tk_prevChar == " " || Tk_cursorPos == 1) && letter == 'n')
 letter = 'n-';

// upper row
anjCh["q"]="\u0B83";
anjCh["w"]="\u0BA8\u0BCD";
anjCh["e"]="\u0B8E";
anjCh["r"]="\u0BB0\u0BCD";
anjCh["t"]="\u0B9F\u0BCD";
anjCh["y"]="\u0BAF\u0BCD";
anjCh["u"]="\u0B89";
anjCh["i"]="\u0B87";
anjCh["o"]="\u0B92";
anjCh["p"]="\u0BAA\u0BCD";

anjCh["Q"]="\u0BB8";
anjCh["W"]="\u0BA8\u0BCD";
anjCh["E"]="\u0B8F";
anjCh["R"]="\u0BB1\u0BCD";
anjCh["T"]="\u0B9F\u0BCD";
anjCh["U"]="\u0B8A";
anjCh["I"]="\u0B88";
anjCh["O"]="\u0B93";
anjCh["P"]="\u0BAA\u0BCD";

//middle row keys
anjCh["a"]="\u0B85";
anjCh["s"]="\u0B9A\u0BCD";
anjCh["d"]="\u0B9F\u0BCD";
anjCh["f"]="\u0B83\u0BAA\u0BCD";
anjCh["g"]="\u0B95\u0BCD";
anjCh["h"]="\u0BB9\u0BCD";
anjCh["j"]="\u0B9C\u0BCD";
anjCh["k"]="\u0B95\u0BCD";
anjCh["l"]="\u0BB2\u0BCD";

anjCh["A"]="\u0B86";
anjCh["S"]="\u0BB8\u0BCD";
anjCh["D"]="\u0B9F\u0BCD";
anjCh["F"]="\u0B83\u0BAA\u0BCD";
anjCh["G"]="\u0B95\u0BCD";
anjCh["H"]="\u0BB9\u0BCD";
anjCh["J"]="\u0B9C\u0BCD";
anjCh["K"]="\u0B95\u0BCD";
anjCh["L"]="\u0BB3\u0BCD";


//bottom row keys
anjCh["z"]="\u0BB4\u0BCD";
anjCh["x"]="\u0B95\u0BCD\u0BB7\u0BCD";
anjCh["c"]="\u0B9A\u0BCD";
anjCh["v"]="\u0BB5\u0BCD";
anjCh["b"]="\u0BAA\u0BCD";
anjCh["n"]="\u0BA9\u0BCD";
anjCh["m"]="\u0BAE\u0BCD";

anjCh["Z"]="\u0BB4\u0BCD";
anjCh["X"]="\u0B95\u0BCD\u0BB7\u0BCD";
anjCh["C"]="\u0B9A\u0BCD";
anjCh["V"]="\u0BB5\u0BCD";
anjCh["B"]="\u0BAA\u0BCD";
anjCh["N"]="\u0BA3\u0BCD";
anjCh["M"]="\u0BAE\u0BCD";

//Complex characters
anjCh["n-"]="\u0BA8\u0BCD";
anjCh["ng"]="\u0B99\u0BCD";
anjCh["nj"]="\u0B9E\u0BCD";
if(Tk_prevPrevChar == 'n')
{
	anjCh["th"]="\u0BA8\u0BCD\u0BA4\u0BCD";
	anjCh["dh"]="\u0BA8\u0BCD\u0BA4\u0BCD";
}
else
{
	anjCh["th"]="\u0BA4\u0BCD";
	anjCh["dh"]="\u0BA4\u0BCD";
}
anjCh["sh"]="\u0BB7\u0BCD";
anjCh["ai"]="\u0B90";
anjCh["au"]="\u0B94";


if(anjCh[letter])
return anjCh[letter];
else
return letter;
}

function Tk_getKeetruAnjal(letter)
{
	var keetru = new Array()
	keetru["a"]="";
	keetru["A"]="\u0bbe";
	keetru["i"]="\u0bbf";
	keetru["I"]="\u0bc0";
	keetru["u"]="\u0bc1";
	keetru["U"]="\u0bc2";
	keetru["e"]="\u0bc6";
	keetru["E"]="\u0bc7";
	keetru["ai"]="\u0bc8";
	keetru["o"]="\u0bca";
	keetru["O"]="\u0bcb";
	keetru["au"]="\u0bcc";
	keetru["q"]="\u0bcd";
	keetru["Q"]="\u0bcd";
	return keetru[letter];
}

function Tk_isVowelAnjal(l) {

var vowelArray = new Array('a', 'A', 'i', 'I', 'u', 'U', 'e', 'E', 'o', 'O');
var i = 0;
while (i<vowelArray.length) {
if (l==vowelArray[i])
return true;
i++;
}
return false;
}

function Tk_isConsonantAnjal(l)
{
	var consonantArray = new Array('k','K', 'g', 'G', 'n', 'c', 'C', 's', 't', 'T','d', 'D', 'N', 'h', 'H', 'w', 'W', '-',
						'p', 'P', 'b', 'B', 'm', 'M', 'y', 'Y', 'r', 'l', 'v', 'V','z', 'Z', 'L', 'R', 'S', 'j', 'J',
					 'X','x','Q','f','F','q','Q');
	var i = 0;
	while (i<consonantArray.length)
	{
		if (l==consonantArray[i])
			return true;
		i++;
	}
	return false;
}


function Tk_isComplexChar(l)
{
	var complexCharArray = new Array('ng', 'nj', 'th', 'dh', 'n-', 'sh', 'ai', 'au');
	var i = 0;
	while (i<complexCharArray.length)
	{
		if (l==complexCharArray[i])
			return true;
		i++;
	}
	return false;
}

function Tk_isNedil(l)
{
	var nedilArray = new Array('A', 'E', 'I', 'O', 'U');
	var i = 0;
	while (i<nedilArray.length)
	{
		if (l==nedilArray[i])
			return true;
		i++;
	}
	return false;
}