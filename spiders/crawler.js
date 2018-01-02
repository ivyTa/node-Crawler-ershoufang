var superagent= require('superagent');
var cheerio= require('cheerio');
var url = require('url');

var qs = require('querystring');

var crawlerUrl="";

var Crawler=function(url){
    crawlerUrl=url;
};
Crawler.prototype={
    getData:function(res){
    superagent.get(crawlerUrl)
        .end(function (err, sres) {
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            //获取总页数
            var lastPageUrl= $('.pagination li:last-child').find('a').attr('href');
            console.log(lastPageUrl);



            if(lastPageUrl!=undefined){
                var queryUrl = url.parse(lastPageUrl).query;
                console.log(queryUrl);
                var obj= qs.parse(queryUrl);
                console.log(obj);

                var totalPages=obj.page;
                console.log(totalPages);
            }else{
                var totalPages=$('.pagination').attr('current_page');
                console.log(totalPages);
            }

            var items = [];

            $('.sellListContent .lj-lazy').each(function (idx, element) {
                var $element = $(element);
                items.push({
                    title: $element.attr('alt'),
                    // href: $element.attr('href'),
                    link:url.resolve(crawlerUrl, $element.attr('data-original')),
                    imgSrc:$element.attr('data-original'),
                });
            });
            items.totalPages=totalPages;

            //return items;
            //res.send(items);
            //console.log(items);


            res.render('list',{
                title:'二手房列表',
                items:items
            });
        });

    }
}

module.exports=Crawler