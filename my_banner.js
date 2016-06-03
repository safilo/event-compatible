/**
 * jQuery轮播图插件封装
 * @authors Your Name (you@example.org)
 * @date    2016-06-01 23:04:27
 * @version $Id$
 */

(function($) {
    function banner(options) {
        options = options || {};
        var _default = {
            url: 'json/data.txt',
            autoInterval: 6000
        };
        $.each(options, function(key, value) {
            _default[key] = this;
        });

        var $banner = $(this),
            $inner = $banner.children('div.inner'),
            $tip = $banner.children('ul.tip'),
            $btnLeft = $banner.children('a.btnLeft'),
            $btnRight = $banner.children('a.btnRight'),
            jsonData = null;
        //Ajax获取json数据
        $.ajax({
            url: _default.url + '?_=' + Math.random(),
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(data) {
                jsonData = data;
            }
        });

        (function() {
            var str = '',
                str2 = '';
            $.each(jsonData, function(index, curData) {
                if (index === 0) {
                    str += '<div style="z-index:1;">';
                    str += '<img src="" trueImg="' + curData["img"] + '"/>';
                    str += '</div>';
                    str2 += '<li class="bg"></li>';
                    return;
                }
                str += '<div>';
                str += '<img src="" trueImg="' + curData["img"] + '"/>';
                str += '</div>';
                str2 += '<li></li>';
            });
            $inner.html(str);
            $tip.html(str2);
        })();

        //延迟加载
        var $divList = $inner.children('div'),
            $imgList = $inner.find('img'),
            $tipList = $tip.children('li');

        function lazyLoad() {
            $imgList.each(function(index, curImg) {
                var oImg = new Image;
                oImg.src = $(this).attr('trueImg');
                oImg.onload = function() {
                    $(curImg).prop('src', this.src).css('display', 'block');
                    if (index === 0) {
                        $(curImg).stop().animate({ opacity: 1 }, 300);
                    }
                    oImg = null;
                };
            });
        }
        window.setTimeout(lazyLoad, 500);

        var step = 0,
            autoTimer = null;

        function changeTip(step) {
            $tipList.eq(step).addClass('bg').siblings().removeClass('bg');
            // $tipList.each(function(index, item) {
            //     index == step ? $(this).addClass('bg') :$(this).removeClass('bg');
            // });
        }

        function setBanner(step) {
            $divList.eq(step).css('zIndex', 1).siblings().css('zIndex', 0);
            $imgList.eq(step).stop().animate({ opacity: 1 }, 300, function() {
                $(this).parent().siblings().children('img').css('opacity', 0);
            });
            changeTip(step);
        }

        function autoMove() {
            step++;
            if (step >= jsonData.length) {
                step = 0;
            }
            console.log(step)
            setBanner(step);
        }
        autoTimer = window.setInterval(autoMove, _default.autoInterval);

        $banner.on('mouseover', function() {
            window.clearInterval(autoTimer);
            $btnLeft.css('display', 'block');
            $btnRight.css('display', 'block');
        }).on('mouseout', function() {
            autoTimer = window.setInterval(autoMove, _default.autoInterval);
            $btnLeft.css('display', 'none');
            $btnRight.css('display', 'none');
        });
        $btnRight.on('click', autoMove);
        $btnLeft.on('click', function() {
            step--;
            if (step < 0) {
                step = jsonData.length - 1;
            }
            setBanner(step);
            changeTip(step);
        });
        $tipList.on('click', function() {
            var step = $(this).index();
            setBanner(step);
            changeTip(step);
        });
    }

    $.fn.extend({
        banner: banner
    });
})(jQuery);
