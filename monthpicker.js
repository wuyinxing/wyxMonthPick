/**
  * @author wyx
  */
(function($, undefined) {

    $.fn.monthpicker = function(options) {
        var months = options.months || ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            years = options.years || (new Date()).getFullYear(),
            firstY = options.firstY || 1970, // 开始年份
            lastY = options.lastY || (new Date()).getFullYear(), //结束年份
            usedmonth = options.usedmonth || [1,2,3,4,5,6,7,8,9,10,11,12]; // 当前年可选择的月

        Monthpicker = function(el) {
            this._el = $(el); //日期input
            this._init();
            this._render();
            this._renderYears();
            this._renderMonths();
            this._bind();
        };

        Monthpicker.prototype = {
            destroy: function() {
                this._el.off('click');
                this._yearsSelect.off('click');
                this._container.off('click');
                $(document).off('click', $.proxy(this._hide, this));
                this._container.remove();
            },

            _init: function() {
                years =  (this._el)[0].value.substring(0,4);
                this.year = (this._el)[0].value.substring(0,4);
                this.month = (this._el)[0].value.substring(5,7);
                this.defaultyear = (this._el)[0].value.substring(0,4);
                this.defaultmonth = (this._el)[0].value.substring(5,7);
            },

            _bind: function() {
                var _this = this;
                this._el.on('click', $.proxy(this._show, this));
                this._dialog.on('click', $.proxy(this._hide, this));
                this._container.on('click', '.mpicker-close',$.proxy(this._hide, this));
                this._container.on('click', function(e) {  e.stopPropagation(); });
                this._container.on('click', '.t-box', $.proxy(this._selectMonth, this));
                this._container.on('click', '.t-mbefore', $.proxy(this._beforeYear, this));
                this._container.on('click', '.t-mafter', $.proxy(this._afterYear, this));
            },

            _show: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this._dialog.css('display', 'block');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                $("body").height($(window).height());

                this.defaultyear = $(e.target).val().substring(0,4);
                this.defaultmonth = $(e.target).val().substring(5,7);
            },

            _hide: function() {
                this._dialog.css('display', 'none');
                document.body.style.overflow = 'scroll';
                document.documentElement.style.overflow = 'scroll';
                $("body").height('auto');
            },

            _afterYear: function(e) {
                if(this.year >= lastY ){
                  return false;
                }
                this._container.find('.t-mbefore').removeClass('disabled');
                this.year = Number(this.year) + 1 ;
                this.year == lastY ? this._container.find('.t-mafter').addClass('disabled') : '';
                this._container.find('.y-num').html(this.year);

                if (options.selectYear) {
                   usedmonth = options.selectYear(this.year);
                   this._renderMonths();
                }else{
                   this._renderMonths();
                }
            },
            _beforeYear:function(e){
               if(this.year <= firstY ){
                  return false;
                }
                this._container.find('.t-mafter').removeClass('disabled');
                this.year = Number(this.year) - 1 ;
                this.year == firstY ? this._container.find('.t-mbefore').addClass('disabled') : '';
                this._container.find('.y-num').html(this.year);
                if (options.selectYear) {
                   usedmonth = options.selectYear(this.year);
                   this._renderMonths();
                }else{
                   this._renderMonths();
                }
            },
            _selectMonth: function(e) {
                var _disabled = $(e.target).hasClass('disabled');
                if (_disabled ) {
                    return false;
                }
                var month = Number($(e.target).data('value')),
                    year = this.year;

                this._container.find('.t-month').removeClass('active');
                $(e.target).addClass('active');    

                if (this._el.attr('type') == "text") {
                    this._el.attr("value", year + '-' + month);
                } else {
                    this._el.html(year + '-' + month);
                }
                if (options.onMonthSelect) {
                    options.onMonthSelect(month, year);
                }

                this._hide();
            },

            _render: function() {
               var  cssOptions = {
                        display: 'none'
                    };
                this._id = (new Date).valueOf();
                this._dialog = $('<div class="monthDialog" id="monthpicker-' + this._id + '"></div>').css(cssOptions).appendTo($('body'));
                this._container =  $('<div class="mpicker-contain"></div>').appendTo(this._dialog);
                this._headerNode = $('<div class="mpicker-head"> <div class="mpicker-close"></div> <span>选择数据时间</span></div>');
                
                this._container.append(this._headerNode);
            },

            _renderYears: function() {
                var __hasBefroe = '' , __hasNext= '' ;
                if(this.year == firstY ){
                   __hasBefroe = "disabled" 
                }
                if(this.year == lastY ){
                   __hasNext = "disabled" 
                } 
                this._yearsNode = $('<div class="mpicker-years">'
                                      +'<div class="t-years">'
                                        +'<div class="t-mbefore '+__hasBefroe+'"></div>'
                                        +'<span class="y-num">'+years+'</span>年'
                                        +'<div class="t-mafter '+__hasNext+'"></div>'
                                      +'</div>'
                                    +'</div>');
                this._container.append(this._yearsNode);
            },

            _renderMonths: function() {
                var _this = this ;
                var markup = ['<div class="mpicker-month">'];
                $.each(months, function(i, month) {
                    var _i = i + 1;
                    var active = '';

                    if(Number(_this.defaultyear) == _this.year && Number(_this.defaultmonth) == _i){
                       active = "active";
                    }
                    if (-1 == $.inArray(_i, usedmonth)) {
                        markup.push('<div class="t-box"><div class="t-month disabled" data-value="' + _i + '">'+month+'月</div></div>');
                    } else {
                        markup.push('<div class="t-box"><div class="t-month '+active+'" data-value=" '+ _i + '">'+month+'月</div></div>');
                    }
                });
                markup.push('</div>');
                this._container.find('.mpicker-month').remove();
                this._container.append(markup.join(''));
            }
        };


        if (typeof options === 'object' || !options) {
            return this.each(function() {
                return new Monthpicker(this);
            });
        } 
    };

}(jQuery));
