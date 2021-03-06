/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_tree	= function()
{
    // Collections
    this.items  = new AMLNodeList;
	this.selectedItems	= new AMLNodeList;
};
cXULElement_tree.prototype	= new cXULSelectElement;
// Accessibility
cXULElement_tree.prototype.tabIndex		= 0;
cXULElement_tree.prototype.$selectable	= false;

// Public Properties
cXULElement_tree.prototype.head	= null;
cXULElement_tree.prototype.body	= null;

// Public Methods
cXULElement_tree.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "disabled")
    {
        // TODO
    }
    else
    if (sName == "seltype")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_tree.prototype.changeOpenState		= function(oRow, bState)
{
	if (oRow && oRow instanceof cXULElement_treerow)
	{
		if (arguments.length < 2)
			bState	= oRow.parentNode.getAttribute("open") != "true";
		oRow.setAttribute("open", bState ? "true" : "false");
	}
};

cXULElement_tree.prototype.ensureRowIsVisible    = function(nIndex)
{
    var oElement    = this.items[nIndex];
    do {
        if (oElement.parentNode.attributes["hidden"] == "true")
            return false;
        oElement    = oElement.parentNode.parentNode;
    } while (oElement != this.body);

    // return true
    return true;
};

cXULElement_tree.prototype.refresh   = function()
{
    if (this.body && this.body.children)
        this.body.children.refresh();
};

// Class Events Hadlers
cXULElement_tree.handlers	= {
	"keydown":	function(oEvent) {
	    if (this.currentItem)
	    {
	        if (oEvent.keyIdentifier == "Up")
	        {
	            // Key: Up
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

	            // Search for the first "previous" visible item
	            while (nIndex - 1 > 0 && this.ensureRowIsVisible(nIndex - 1) == false)
	                nIndex--;

	            if (nIndex > 0)
	            {
	                if (oEvent.shiftKey)
	                {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex++;

	                    this.toggleItemSelection(this.items[nIndex-1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex-1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex-1);
	            }
	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Down")
	        {
	            // Key: Down
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

	            // Search for the first "next" visible item
	            while (nIndex + 1 < this.items.length && this.ensureRowIsVisible(nIndex + 1) == false)
	                nIndex++;

	            if (nIndex < this.items.length - 1)
	            {
	                if (oEvent.shiftKey)
	                {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex--;

	                    this.toggleItemSelection(this.items[nIndex+1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex+1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex+1);
	            }
	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Right")
	        {
	            // Key: Right
	            if (this.currentItem.children)
	            {
	                if (this.currentItem.attributes["open"] == "true")
	                    this.selectItem(this.currentItem.children.items[0]);
	                else
	                    this.currentItem.setAttribute("open", "true");
	            }

	            // Forbid horizontal scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Left")
	        {
	            // Key: Left
	            if (this.currentItem.children && this.currentItem.attributes["open"] == "true")
	                this.currentItem.setAttribute("open", "false");
	            else
	            if (this.currentItem.parentNode.parentNode != this.body)
	                this.selectItem(this.currentItem.parentNode.parentNode);

	            // Forbid horizontal scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Enter")
	        {
	            // Key: Enter
	            if (this.currentItem.children)
	                this.currentItem.setAttribute("open", this.currentItem.attributes["open"] == "true" ? "false" : "true");
	        }
	    }
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_treebody)
			this.body = oEvent.target;
		else
		if (oEvent.target instanceof cXULElement_treecols)
			this.head = oEvent.target;
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_treebody)
			this.body = null;
		else
		if (oEvent.target instanceof cXULElement_treecols)
			this.head = null;
	}
};

// Element Render: open
cXULElement_tree.prototype.$getTagOpen		= function()
{
    return '<table class="xul-tree' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0" height="' +(this.attributes["height"] ? this.attributes["height"] : '100%')+ '" width="' +(this.attributes["width"] ? this.attributes["width"] : '100%')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '')+ '>\
    			<tbody class="xul-tree--gateway">';
};

// Element Render: close
cXULElement_tree.prototype.$getTagClose	= function()
{
    return 		'</tbody>\
    		</table>';
};

// Register Element with language
oXULNamespace.setElement("tree", cXULElement_tree);
