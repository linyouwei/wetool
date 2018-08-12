$(function(){
    var domain = 'http://localhost:4001/'
    var showFile = function(path){
        if(!path) path='';
        $.get(domain+'/index/Index/read?path='+path,function(res){
            var dir = res.dir;
            var file = res.file;
            var num = dir.length+file.length;
            var rowTemplate = $($("#rowTemplate").clone().html());
            var docBody = $("#container");
            var rowListTemplate = '';
            //少于12个文件,只有一个row
                var colListTemplate = "";
                $.each(dir,function(key,value){//拼接模板
                    var colTemplate = $($("#colTemplate").clone().html())
                    colTemplate.addClass('a-dir');
                    colTemplate.find('img').attr('src','/static/images/folder.png')
                    colTemplate.find('.gallery-title').html(value);
                    colListTemplate +=colTemplate.prop('outerHTML');
                })
                $.each(file, function (key,value) {
                    var colTemplate = $($("#colTemplate").clone().html())
                    colTemplate.addClass('a-file');
                    //文件名处理
                    if(checkFileExt(value)){
                        colTemplate.find('img').attr('src','/static/images/txt.png')
                    }else{
                        colTemplate.find('img').attr('src','/static/images/unknown.png')
                    }
                    colTemplate.find('gallery-title').html(value);
                    colListTemplate +=colTemplate.prop('outerHTML');
                })
                rowTemplate.html(colListTemplate);
                rowListTemplate  = rowTemplate.prop('outerHTML');
                docBody.html(rowListTemplate);
        })
    }
    showFile();
    //检查文件格式，也许掌握用正则的做法。
    var checkFileExt = function(filename){
        var flag = false;
        var arr = ['txt','TXT'];
        var extend_name = filename.lastIndexOf(".");
        for(var i=0;i<arr.length;i++){
            if(arr[0]==extend_name){
                flag =  true;
                break
            }
        }
        return flag;
    }

     //先对目录绑定事件
    var bindDir = function(){
        $("#container").on('click','.a-dir',function(e){
            var path = $(this).find('.gallery-title').text();
            //在id=catalog补上新的button
            var btnHtml = '<button type="button" class="btn-raised btn-primary" data-value="'+path+'/">'+path+'</button>';
            $("#catalog").append(btnHtml);
            //在showFile前需要确定该文件的路径,通过id=catalog的div确定button的数量，
            btn_disabled();
            showFile(btn_sum());
        })
    }
    bindDir();

    //拼接当前所有button的路径。
    var btn_sum = function(){
        var split_path = '';
        $("#catalog button").each(function(){
            split_path += $(this).data().value;
        })
        return split_path;
    }
    //禁用最后一个btn
    var btn_disabled = function(){
        $("#catalog button:last").siblings().attr('disabled',false)
        $("#catalog button:last").attr('disabled','disabled')
    }


    //对导航栏的按钮绑定事件
    $("#catalog").on('click','button',function(){
        //split_path 请求路径的拼接。
        split_path = '';
        $(this).prevAll().each(function(){
            split_path += $(this).data().value;
        })
        split_path +=  $(this).data().value;
        showFile(split_path)

        //需要把点击的button的后面的button给删除掉
        //1、获得当前的button的值,
        var start = $(this).index()+1;
        var btn_len = $("#catalog button").length;
        //2、删除从当前元素之后的所有button。
        for(start;start<btn_len;start++ ){
            $("#catalog button").eq(start).remove();
        }
    })
    //下载
    $('#fileDownload').click(function () {
        window.open('/index/Index/download?file=' + $(this).data('file'));
    });


})