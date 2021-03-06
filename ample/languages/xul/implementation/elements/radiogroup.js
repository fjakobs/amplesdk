/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_radiogroup	= function()
{
    // Collections
    this.items      = new AMLNodeList;
};
cXULElement_radiogroup.prototype	= new cXULElement;
cXULElement_radiogroup.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;
cXULElement_radiogroup.prototype.tabIndex	= 0;

// Public Properties
cXULElement_radiogroup.prototype.selectedIndex	=-1;
cXULElement_radiogroup.prototype.selectedItem	= null;

// Attributes Defaults
cXULElement_radiogroup.attributes	= {};
cXULElement_radiogroup.attributes.orient	= "vertical";
cXULElement_radiogroup.attributes.value	= "";

// Public Methods
cXULElement_radiogroup.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            if (this.items[nIndex].attributes["value"] == sValue)
            {
                this.items[nIndex].setAttribute("selected", "true");
                break;
            }
        }
    }
    else
    if (sName == "disabled")
    {
    	var oElementDOM	= this.$getContainer();
    	this.$setPseudoClass("disabled", sValue == "true");
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
            this.items.setAttribute(sName, sValue);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_radiogroup.prototype.appendItem  = function(sName, sValue)
{

};

cXULElement_radiogroup.prototype.insertItemAt= function(nIndex, sName, sValue)
{

};

cXULElement_radiogroup.prototype.removeItemAt= function(nIndex)
{

};

// Element Render: open
cXULElement_radiogroup.prototype.$getTagOpen	= function()
{
    return '<div class="xul-radiogroup' + (this.attributes["disabled"] == "true" ? " xul-radiogroup_disabled" : "") + '">';
};

// Element Render: close
cXULElement_radiogroup.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("radiogroup", cXULElement_radiogroup);
