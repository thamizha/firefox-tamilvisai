function Tk_baminikeyboard()
{
Tk_tamilMode = true;
Tk_prevChar = "";
Tk_oldPrevChar = "";
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressBamini);
return;
}

function Tk_handleKeyPressBamini(evt)
{
	if(!evt.cancelable) // bamini char -> don't process
		return;
	if(evt.keyCode >= 33 && evt.keyCode <= 40) // handle cursor moves
	{
		Tk_oldPrevChar = Tk_prevChar;
		Tk_prevChar = "";
		return;
	}
	else if(evt.keyCode == 46) // handle delete
	{
		Tk_doDel(evt);
		return;
	}
	else if(evt.keyCode == 8 || evt.keyCode == 13 ) // handle backspace
	{
		Tk_oldPrevChar = Tk_prevChar;
		Tk_prevChar = "";
		if(evt.keyCode == 8)
			Tk_doBS(evt);
		else
			Tk_prevChar = "\n";
		return;
	}
	if (evt.charCode && Tk_tamilMode && !evt.ctrlKey)
	{
		if (evt.charCode > 255)
			return; // dont capture tamil events
		Tk_myChar = String.fromCharCode(evt.charCode);
		Tk_myTChar = Tk_getBamChar(Tk_myChar);
		var editor =  (document.commandDispatcher.focusedElement instanceof
						Components.interfaces.nsIDOMNSEditableElement) ?
						document.commandDispatcher.focusedElement.editor : null
		if(editor)
		{
			var myField = evt.target;
			Tk_prevChar = myField.value.substring(myField.selectionStart - 1, myField.selectionStart);
			var prevStr = myField.value.substring(0,myField.selectionStart - 1);
			var postStr = myField.value.substring(myField.selectionEnd,myField.value.length);


			//remove the zero width non joiner and reverse the otru
			if( Tk_prevChar != "" && Tk_isBAKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1 )
			{
				Tk_myTChar = Tk_myTChar.reverse();
				prevStr = prevStr.replace("\u200C","");
			}

			var len = prevStr.length ;
			var sPos = myField.selectionEnd ;
			var charAdded = myField.value.length;
			var txtTop = myField.scrollTop;

			if (evt.target.type != "text" && evt.target.type != "textarea" )
			{
				prevStr = myField.value;
				len = prevStr.length ;
				postStr = "";
			}
			if(Tk_myTChar != Tk_myChar)
				myField.value = prevStr + Tk_myTChar + postStr;
			else
				myField.value = prevStr + Tk_prevChar + Tk_myTChar + postStr ;

			evt.stopPropagation();
			evt.preventDefault();
			charAdded = myField.value.length - charAdded;
			myField.scrollTop = txtTop;

			if(evt.target.id != 'urlbar' )
			{
				myField.selectionStart = sPos + charAdded;
				myField.selectionEnd = sPos + charAdded;
			}
			if( Tk_myTChar.length >= 2)
				Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
			else
				Tk_oldPrevChar = Tk_prevChar;
			Tk_prevChar = Tk_myTChar.substring(Tk_myTChar.length - 1, Tk_myTChar.length);
		}
		else
		{
			if(Tk_myTChar != (Tk_prevChar + Tk_myChar))
			{
				var i = 0;
				//remove the zero width non joiner and reverse the otru
				if( Tk_prevChar != "")
				{
					if(Tk_isBAKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1 )
					{
						Tk_myTChar = Tk_myTChar.reverse();
						var evnt = window.document.createEvent("KeyEvents");
						evnt.initKeyEvent("keypress", true,  true, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 8, 0);
						evt.target.dispatchEvent(evnt);
					}
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true,  true, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 8, 0);
					evt.target.dispatchEvent(evnt);
				}

				if( Tk_myTChar.length >= 2)
					Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
				else
					Tk_oldPrevChar = Tk_prevChar;

				while(i < Tk_myTChar.length)
				{
					var Tk_prevCharCode = Tk_myTChar.charCodeAt(i);
					Tk_prevChar = String.fromCharCode(Tk_prevCharCode);
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, false, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, Tk_prevCharCode);
					evt.target.dispatchEvent(evnt);
					i++;
				}
				evt.stopPropagation();
				evt.preventDefault();
			}
			else
			{
				if( Tk_myTChar.length >= 2)
					Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
				else
					Tk_oldPrevChar = Tk_prevChar;
				Tk_prevChar = Tk_myTChar.substring(Tk_myTChar.length -1, Tk_myTChar.length);
			}
		}
	}
	else
		return;
}

function Tk_isBAKombuPulli(prevletter)
{
	if(prevletter == "\u0BC6" //e kombu
		|| prevletter == "\u0BC7" //E kombu
		|| prevletter == "\u0BC8" //ai kombu
		)
			return true;
	else
		return false;
}

function Tk_getBamChar(letter)
{
var bamCh = new Array();
bamCh['\''] = "\u201C";
bamCh['q'] = "\u0B99";
bamCh['w'] = "\u0BB1";
bamCh['e'] = "\u0BA8";
bamCh['r'] = "\u0B9A";
bamCh['t'] = "\u0BB5";
bamCh['y'] = "\u0BB2";
bamCh['u'] = "\u0BB0";
bamCh['o'] = "\u0BB4";
bamCh['['] = "\u0B9C";
bamCh[']'] = "\u0BB8";
bamCh['a'] = "\u0BAF";
bamCh['s'] = "\u0BB3";
bamCh['d'] = "\u0BA9";
bamCh['f'] = "\u0B95";
bamCh['g'] = "\u0BAA";
bamCh['j'] = "\u0BA4";
bamCh['k'] = "\u0BAE";
bamCh['l'] = "\u0B9F";
bamCh['z'] = "\u0BA3";
bamCh['x'] = "\u0B92";
bamCh['c'] = "\u0B89";
bamCh['v'] = "\u0B8E";
bamCh['b'] = "\u0B9F\u0BBF";
bamCh['m'] = "\u0B85";
bamCh[','] = "\u0B87";
bamCh['/'] = "\u0B83";
bamCh['\\'] = "\u0BB7";
bamCh['`'] = "\u0BB9";
bamCh['='] = "\u0BB8\u0BCD\u0BB0\u0BC0";

bamCh['Q'] = "\u0B9E";
bamCh['W'] = "\u0BB1\u0BC1";
bamCh['E'] = "\u0BA8\u0BC1";
bamCh['R'] = "\u0B9A\u0BC1";
bamCh['T'] = "\u0BB5\u0BC1";
bamCh['Y'] = "\u0BB2\u0BC1";
bamCh['U'] = "\u0BB0\u0BC1";
bamCh['I'] = "\u0B90";
bamCh['O'] = "\u0BB4\u0BC1";
bamCh['{'] = "\u0BC1";
bamCh['}'] = "\u0BC2";
bamCh['A'] = "\u0BAF\u0BC1";
bamCh['S'] = "\u0BB3\u0BC1";
bamCh['D'] = "\u0BA9\u0BC1";
bamCh['F'] = "\u0B95\u0BC1";
bamCh['G'] = "\u0BAA\u0BC1";
bamCh['H'] = "\u0BB0\u0BCD";
bamCh['J'] = "\u0BA4\u0BC1";
bamCh['K'] = "\u0BAE\u0BC1";
bamCh['L'] = "\u0B9F\u0BC1";
bamCh['"'] = "\u201D";

bamCh['Z'] = "\u0BA3\u0BC1";
bamCh['X'] = "\u0B93";
bamCh['C'] = "\u0B8A";
bamCh['V'] = "\u0B8F";
bamCh['B'] = "\u0B9F\u0BC0";
bamCh['M'] = "\u0B86";
bamCh['<'] = "\u0B88";
bamCh['>'] = ",";
bamCh['|'] = "\u2019";
bamCh['~'] = "\u2018";
bamCh['@'] = ";";
bamCh['#'] = "\u0B9A\u0BC2";
bamCh['$'] = "\u0B95\u0BC2";
bamCh['%'] = "\u0BAE\u0BC2";
bamCh['^'] = "\u0B9F\u0BC2";
bamCh['&'] = "\u0BB0\u0BC2";
bamCh['*'] = "\u0BB4\u0BC2";
bamCh[';'] = "\u0BCD";

bamCh['N'] = "\u0BC7";
bamCh['n'] = "\u0BC6";
bamCh['i'] = "\u0BC8";
bamCh['h'] = "\u0BBE";
bamCh['p'] = "\u0BBF";
bamCh['P'] = "\u0BC0";
bamCh['_'] = "\u0BC2";
bamCh['+'] =  "\u0BC2";

if(bamCh[letter])
{
	if(Tk_isBAKombuPulli(bamCh[letter]))
		bamCh[letter] = "\u200C"+bamCh[letter];
	if(Tk_prevChar == "\u0BC1" && (bamCh[letter] == "\u0BBE"  || bamCh[letter] == "\u0BC2") )
		return "\u0BC2";
	else if (Tk_prevChar == "\u0BC6" && bamCh[letter] == "\u0BBE")
		return "\u0BCA";
	else if (Tk_oldPrevChar != "\u200C" && Tk_prevChar == "\u0BC6" &&	bamCh[letter] == "\u0BB3")
		return "\u0BCC";
	else if (Tk_prevChar == "\u0BC7" && bamCh[letter] == "\u0BBE")
		return "\u0BCB";
	else if(Tk_prevChar == "\u0B92" && bamCh[letter] == "\u0BB3")
		return "\u0B94";
	else if(Tk_prevChar == "\u0BCC" && (bamCh[letter] == "\u0BBE" ||
			bamCh[letter] == "\u0BBF" || bamCh[letter] == "\u0BC0" ||
			bamCh[letter] == "\u0BC1" || bamCh[letter] == "\u0BC2" ||
			bamCh[letter] == "\u0BCD") )
		return "\u0BC6\u0BB3"+bamCh[letter];
	else if(Tk_prevChar == "\u0B94" && (bamCh[letter] == "\u0BBE" ||
			bamCh[letter] == "\u0BBF" || bamCh[letter] == "\u0BC0" ||
			bamCh[letter] == "\u0BC1" || bamCh[letter] == "\u0BC2" ||
			bamCh[letter] == "\u0BCD") )
		return "\u0B92\u0BB3"+bamCh[letter];
	else
		return Tk_prevChar + bamCh[letter];
}
else
	return  Tk_prevChar + letter;
}
