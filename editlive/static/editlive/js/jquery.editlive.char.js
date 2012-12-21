;(function($){

    $.widget('editliveWidgets.charField', {
        _type: 'char',
        _active: false,
        widgetEventPrefix: 'editlive',
        placeholdertag: 'span',
        value: undefined,
        options: {
            minwidth: 120,
            maxwidth: 'auto',
            emptyvalue: 'Cliquer pour modifier',
            wrapclass: 'inline',
            errorplacement: 'bottom',
            mini: false,
            small: false,
            large: false,
            input_prepend: '',
            input_append: '',
            highlight: {
                duration: 300,
                effect: 'highlight',
                options: {color: '#ff9'}
            }
        },

        // Setup the widget
        _create: function() {
            var $self = this;
            $self.value        = $self._get_value();
            $self.editlive     = $self.element.data('widget.editlive');
            $self.options      = $.extend($self.options, $self.editlive.data());
            $self.control      = $('<div class="controls editlive-controls '+ $self.options.wrapclass +'" />');
            $self.field_name   = $self.editlive.attr('field-name'); 
            $self.object_id    = $self.editlive.attr('object-id');
            $self.app_label    = $self.editlive.attr('app-label');
            $self.module_name  = $self.editlive.attr('module-name');
            $self.rendered_val = $self.editlive.attr('rendered-value');
            $self.tpl_filters  = $self.editlive.attr('template_filters');
            $self.load_tags    = $self.editlive.attr('load_tags');

            if ($self.options.maxwidth != 'auto') {
                $self.control.css('max-width', $self.options.maxwidth);
                $self.element.css('max-width', $self.options.maxwidth);
            }

            if ($self.options.width) {
                var chim = parseInt($self.element.css('padding-left').match(/\d+/)[0], 10) 
                           + parseInt($self.element.css('padding-right').match(/\d+/)[0], 10);
                $self.element.css('width', $self.options.width - chim);
            }

            $self.element.hide().wrap($self.control);

            if ($self.options.input_prepend != '') {
                var addon = $('<span class="add-on" />').css('display', 'none').insertBefore(this.element),
                    p = this.options.input_prepend;
                $self.element.parents('.editlive-controls').addClass('input-prepend');
                if (p.indexOf('<') > -1) { addon.html(p); }
                else { addon.text(p); }
            }
            if ($self.options.input_append != '') {
                var addon = $('<span class="add-on" />').css('display', 'none').insertAfter(this.element),
                    p = this.options.input_append;
                $self.element.parents('.editlive-controls').addClass('input-append');
                if (p.indexOf('<') > -1) { addon.html(p); }
                else { addon.text(p); }
            }

            $self.element.data('editlive', $self);
        },

        _init: function(){
            var $self = this;
            $self._createPlaceholder();
            if ($self.options.width) {
                var chim = parseInt($self.placeholder.css('padding-left').match(/\d+/)[0], 10) 
                           + parseInt($self.placeholder.css('padding-right').match(/\d+/)[0], 10);
                $self.placeholder.css('width', $self.options.width - chim);
            }
        },

        _get_value: function() {
            return this.element.val();
        },

        _set_value: function(v) {
            this.value = v;
            this.element.val(v);
            return v;       
        },

        _highlight: function(){
            var $self = this;
            var startColor = $self.options.highlight.options.color;
            var endColor   = $self._placeholderColor;

            if ($.effects.highlight) {
                var el = $self.placeholder || $self.element;
                el.animate({backgroundColor: startColor}, 
                    $self.options.highlight.duration / 2,
                    function() {
                        setTimeout(function(){
                            try {
                                el.animate({backgroundColor: endColor}, 
                                    $self.options.highlight.duration / 2);
                            } catch(e) {
                                // This will happen when the initial background color is transparent
                                el.css('backgroundColor', 'transparent');
                            };
                        }, 250);
                    });
            }
        },

        _createPlaceholder: function(el) {
            var $self = this;
            $self.placeholder = $('<'+ $self.placeholdertag +' class="editlive editlive-'+ $self._type +'" />')
                                    .insertAfter(el || $self.element);
            if ($self.options['class']) {
                $self.placeholder.addClass($self.options['class']);
            }
            if ($self.options.mini)  { $self.element.addClass('eie-mini');  $self.placeholder.addClass('eph-mini'); }
            if ($self.options.small) { $self.element.addClass('eie-small'); $self.placeholder.addClass('eph-small'); }
            if ($self.options.large) { $self.element.addClass('eie-large'); $self.placeholder.addClass('eph-large'); }
            $self.placeholder.bind('click.editlive', function(e) {
                $self.focus();
            });
            $self.set_placeholder_value();
            $self._placeholderColor = $self.placeholder.css('backgroundColor');
        },

        // Respond to changes to options
        _setOption: function( key, value ) {
            switch(key) {
                case "clear":
                    // handle changes to clear option
                    break;
            }
            // In jQuery UI 1.9 and above, you use the _super method instead
            // this._super("_setOption", key, value);
            // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        _get_width: function() {
            if (this.option.width) return this.option.width;
            var width = this.placeholder.width();
            if (this.control.width() > 0 && width > this.control.width()) width = this.control.width() - 10;
            if (width < this.option.minwidth) width = this.option.minwidth;
            if (width < 0) width = 'none';
            return width;
        },

        _watch_blur: function(el) {
            // The element passed as argument
            // will not trigger the blur
            var $self = this;
            $('html').bind('click.editlive_'+ $self.element.attr('id'), function(e){
                var targetId = $(e.target).attr('id')
                if (typeof(targetId) == 'undefined') {
                    if (!$(e.target).hasClass('editlive') && !$(e.target).parents('.editlive').get(0)) {
                        $self.blur();
                    }
                }
                else {
                    if (targetId != (el || $self.element).attr('id')) {
                        $self.blur();
                    }

                }
            });
        },

        _unwatch_blur: function() {
            $('html').unbind('click.editlive_'+ this.element.attr('id'))
        },

        _bind_kb_blur_events: function(el) {
            var $self = this;
            (el || $self.element).bind('keyup.editlive', function(e){
                if (e.keyCode == 13) $self.blur();     // enter
                if (e.keyCode == 27) $self.blur(true); // escape (no save)
            });
        },

        _unbind_kb_blur_events: function(el) {
            (el || this.element).unbind('keyup.editlive');
        },

        _set_element_width: function(el) {
            var el = el || this.element;
            if (!this.options.width) el.width(this._get_width());
            if (this.control.hasClass('block')) {
                el.css('display', 'inline-block');
            }
        },

        _saved: function(data) {
            var $self = this;
            if (data.error) {
                $self.error(data);
            }
            else {
                $self.success(data);
            }
        },

        _display_error: function(error) {
            this.element.tooltip({
                title: error.message,
                placement: this.options.errorplacement
            }).tooltip('show');
        },

        _display_errors: function(errors) {
            var $self = this;
            $.each(errors, function(k, v) {
                if (v.field_name == $self.field_name) {
                    $self._display_error(v);
                }
            });
        },

        _destroy_errors: function() {
            this.element.tooltip('destroy');
        },

        focus: function(e){
            var $self = this;
            $self._trigger('focus')
            $self.show();
            if (typeof($self._parent_is_btn) == 'undefined') {
                $self._parent_is_btn = $self.control.hasClass('btn');
            }
            $self.control.removeClass('btn');
            $self._trigger('focused')
        },

        blur: function(cancel){
            var $self = this;
            if ($self._parent_is_btn) {
                $self.input.parents('.editlive-controls').addClass('btn');
            }
            if (cancel) {
                $self._set_value($self.value);
                $self.hide();
            }
            else if ($self.value != $self._get_value()) {
                $self.value = $self._get_value();
                $self.change();
            }
            else {
                $self.hide();
            }
            $self._trigger('blur');
        },

        show: function() {
            this._bind_kb_blur_events();
            this._set_element_width();
            this._watch_blur();
            if (this.placeholder) this.placeholder.hide();
            this.element.show().focus()
                .parent().find('.add-on').css('display', 'inline-block');
            if (this.options.input_prepend != '') {
                this.element.parents('.editlive-controls').addClass('input-prepend');
            }
            if (this.options.input_append != '') {
                this.element.parents('.editlive-controls').addClass('input-append');
            }
        },

        hide: function() {
            this._unwatch_blur();
            this._unbind_kb_blur_events();
            this.element.hide()
                .parent().find('.add-on').css('display', 'none');
            if (this.placeholder) this.placeholder.show();
        },

        change: function(){
            var $self = this;
            $self.save();
            $self._trigger('change');
        },

        get_display_value: function() {
            return this.rendered_val || this.element.val();
        },

        set_placeholder_value: function(display) {
            if (this.placeholder) {
                var p = this.options.input_prepend,
                    a = this.options.input_append,
                    v = display || this.get_display_value() || this.options.emptyvalue,
                    o = [a, v, p].join('');
                if (o.indexOf('<') > -1) {
                    this.placeholder.html(o);
                }
                else {
                    this.placeholder.text(o);
                }
            }
        },

        save: function() {
            var $self = this;
            $self._trigger('save');
            Dajaxice.editlive.save($.proxy($self._saved, $self), {
                field_value:   $self._get_value(), 
                field_name:    $self.field_name, 
                object_id:     $self.object_id,
                app_label:     $self.app_label,
                module_name:   $self.module_name,
                tpl_filters:   $self.tpl_filters,
                load_tags:     $self.load_tags
            });
        },

        success: function(data) {
            var $self = this;
            if (typeof(data.rendered_value) != 'undefined') {
                $self.rendered_val = data.rendered_value;
            }
            $self.set_placeholder_value();
            $self.control.removeClass('error');
            $self.blur(true);
            if (!$self._parent_is_btn && $self.placeholder) {
                $self._highlight();
            }
            $self._destroy_errors();
            $self._trigger('success');
        },

        error: function(data) {
            var $self = this;
            $self.control.addClass('error');
            $self._display_errors(data.messages);
            $self._trigger('error');
        },

        // Clean up any modifications made to the DOM
        destroy: function() {
            var $self = this;
            // In jQuery UI 1.9 and above, you would define _destroy instead of 
            // destroy and not call the base method
            $.Widget.prototype.destroy.call($self);
            $self.element.show();
            if ($self.placeholder) {
                $self.placeholder.remove();
            }
        }
    });

})(jQuery);
