/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_thead	= function()
{
	this.rows	= new AMLNodeList;
};
cXHTMLElement_thead.prototype	= new cXHTMLElement;

// Public Methods
cXHTMLElement_thead.prototype.insertRow	= function(nIndex)
{
	var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "tr");
	return nIndex ==-1 ? this.appendChild(oElement) : this.insertBefore(oElement, this.rows[nIndex]);
};

cXHTMLElement_thead.prototype.deleteRow	= function(nIndex)
{
	return this.removeChild(this.rows[nIndex]);
};

// Class events handlers
cXHTMLElement_thead.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_tr)
				this.rows.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_tr)
				this.rows.$remove(oEvent.target);
	}
};

// Register Element with language
oXHTMLNamespace.setElement("thead", cXHTMLElement_thead);
