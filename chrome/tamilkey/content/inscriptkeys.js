function Tk_inscriptkeyboard()
{
Tk_tamilMode = true;
Tk_prevChar = "";
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressInscript);
return;
}

function Tk_handleKeyPressInscript(evt)
{
	if(!evt.cancelable) // inscript char -> don't process
		return;
	if(evt.keyCode >= 33 && evt.keyCode <= 40) // handle cursor moves
	{
		Tk_prevChar = "";
		return;
	}
	else if(evt.keyCode == 46) // handle delete
	{
		Tk_prevChar = "";
		Tk_doDel(evt);
		return;
	}
	else if(evt.keyCode == 8 || evt.keyCode == 13 ) // handle backspace
	{
		Tk_prevChar = "";
		if(evt.keyCode == 8)
			Tk_doBS(evt);
		return;
	}
	if (evt.charCode && Tk_tamilMode && !evt.ctrlKey)
	{
		if (evt.charCode > 255)
			return; // dont capture tamil events
		Tk_myChar = String.fromCharCode(evt.charCode);
		Tk_myTChar = Tk_getInscriptChar(Tk_myChar);

		var editor =  (document.commandDispatcher.focusedElement instanceof
						Components.interfaces.nsIDOMNSEditableElement) ?
						document.commandDispatcher.focusedElement.editor : null
		if(editor)
		{
			var myField = evt.target;
			Tk_prevChar = myField.value.substring(myField.selectionStart - 1, myField.selectionStart);
			var prevStr = myField.value.substring(0,myField.selectionStart - 1);
			var postStr = myField.value.substring(myField.selectionEnd,myField.value.length);

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
				myField.value = prevStr + Tk_myTChar + postStr ;
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
			Tk_prevChar = Tk_myTChar;
			Tk_prevChar = Tk_prevChar.substring(Tk_prevChar.length -1, Tk_prevChar.length);
		}
		else
		{
			if(Tk_myTChar != (Tk_prevChar + Tk_myChar))
			{

				var i = 0;
				if(Tk_prevChar != "")
				{
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, true, window.document.defaultView, false, false, false, false, 8, 0);
					evt.target.dispatchEvent(evnt);
				}
				while(i < Tk_myTChar.length)
				{
					var Tk_prevCharCode = Tk_myTChar.charCodeAt(i);
					Tk_prevChar = String.fromCharCode(Tk_prevCharCode);
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, false, window.document.defaultView, false, false, false, false, 0, Tk_prevCharCode);
					evt.target.dispatchEvent(evnt);
					i++;
				}
				evt.stopPropagation();
				evt.preventDefault();
			}
			else
				Tk_prevChar = Tk_myTChar.substring(Tk_myTChar.length -1, Tk_myTChar.length);


		}
	}
	else
		return;
}

function Tk_getInscriptChar(letter)
{
var insCh = new Array();








insCh['`'] = "\u0BCA";
insCh['1'] = "\u0BE7";
insCh['2'] = "\u0BE8";
insCh['3'] = "\u0BE9";
insCh['4'] = "\u0BEA";
insCh['5'] = "\u0BEB";
insCh['6'] = "\u0BEC";
insCh['7'] = "\u0BED";
insCh['8'] = "\u0BEE";
insCh['9'] = "\u0BEF";
insCh['0'] = "0";
insCh['-'] = "-";

insCh['~'] = "\u0B92";
insCh['!'] = "";
insCh['@'] = "";
insCh['#'] = "\u0BCD\u0BB0";
insCh['$'] = "\u0BB0\u0BCD";
insCh['%'] = "\u0B9C\u0BCD\u0B9E";
insCh['^'] = "\u0BA4\u0BCD\u0BB0";
insCh['&'] = "\u0B95\u0BCD\u0BB7";
insCh['*'] = "\u0BB7\u0BCD\u0BB0";
insCh['('] = "(";
insCh[')'] = ")";
insCh['_'] = "\u0B83";

insCh['q'] = "\u0BCC";
insCh['w'] = "\u0BC8";
insCh['e'] = "\u0BBE";
insCh['r'] = "\u0BC0";
insCh['t'] = "\u0BC2";
insCh['y'] = "";
insCh['u'] = "\u0BB9";
insCh['i'] = "";
insCh['o'] = "";
insCh['p'] = "\u0B9C";
insCh['['] = "[";
insCh[']'] = "]";
insCh["\\"] = "\\";

insCh['Q'] = "\u0B94";
insCh['W'] = "\u0B90";
insCh['E'] = "\u0B86";
insCh['R'] = "\u0B88";
insCh['T'] = "\u0B8A";
insCh['Y'] = "";
insCh['U'] = "\u0B99";
insCh['I'] = "";
insCh['O'] = "";
insCh['P'] = "";
insCh['{'] = "";
insCh['}'] = "\u0B9E";

insCh['a'] = "\u0BCB";
insCh['s'] = "\u0BC7";
insCh['d'] = "\u0BCD";
insCh['f'] = "\u0BBF";
insCh['g'] = "\u0BC1";
insCh['h'] = "\u0BAA";
insCh['j'] = "\u0BB0";
insCh['k'] = "\u0B95";
insCh['l'] = "\u0BA4";
insCh[';'] = "\u0B9A";
insCh['\''] = "\u0B9F";

insCh['A'] = "\u0B93";
insCh['S'] = "\u0B8F";
insCh['D'] = "\u0B85";
insCh['F'] = "\u0B87";
insCh['G'] = "\u0B89";
insCh['H'] = "";
insCh['J'] = "\u0BB1";
insCh['K'] = "";
insCh['L'] = "";
insCh[':'] = "";
insCh['"'] = "";

insCh['z'] = "\u0BC6";
insCh['x'] = "\u0BCD";
insCh['c'] = "\u0BAE";
insCh['v'] = "\u0BA8";
insCh['b'] = "\u0BB5";
insCh['n'] = "\u0BB2";
insCh['m'] = "\u0BB8";
insCh[','] = ",";
insCh['.'] = ".";
insCh['/'] = "\u0BAF";

insCh['Z'] = "\u0B8E";
insCh['X'] = "";
insCh['C'] = "\u0BA3";
insCh['V'] = "\u0BA9";
insCh['B'] = "\u0BB4";
insCh['N'] = "\u0BB3";
insCh['M'] = "";
insCh['<'] = "\u0BB7";
insCh['>'] = "";
insCh['?'] = "";

insCh['|'] = "";
insCh['+'] = "";
insCh['='] = "";

if(insCh[letter])
{
	if(Tk_prevChar == "\u0BC1" && insCh[letter] == "\u0BC2")
		return insCh[letter];
	if(Tk_prevChar == "\u0BC6" || Tk_prevChar == "\u0BC7" || Tk_prevChar == "\u0BC8" )
		return insCh[letter]+Tk_prevChar ;
	else
		return Tk_prevChar + insCh[letter];
}
else
	return Tk_prevChar + letter;
}
