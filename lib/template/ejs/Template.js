var Class = require('../../class'),
    Template = require('../Template');

module.exports = new Class({

    Extends: Template,

    compile: function() {
        var head = 'var p=[],print=function(){p.push.apply(p,arguments);};',
            wrapper = ["with(obj){p.push(\'", "');}return p.join('');"];
        
        var inner = this.template
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            
            //operators. like <%, <%=, <%?
            
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            //.replace(/\t:(.*?)%>/g, "',new Element('div').set('text',$1).get('html'),'")
            .replace(/\t\?(.*?)%>/g, "',(typeof $1 != 'undefined')?$1:'','")
    
            
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'");
        
        this.compiled = new Function('obj', head + wrapper.join(inner));
    }
});
