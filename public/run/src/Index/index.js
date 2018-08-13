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
                    colTemplate.find('.gallery-title').html(value);
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
           //得到当前button的div的内容
            var btn_nav = $("#catalog").html();
            $("#catalog").empty();
            var btnHtml = '<button type="button" class="btn-raised btn-primary" data-value="'+path+'/">'+path+'</button>';
            var btn = btn_nav+ btnHtml;
            $("#catalog").append(btn);
            //在showFile前需要确定该文件的路径,通过id=catalog的div确定button的数量，
            btn_disabled();
            showFile(btn_split());
        })
    }
    var bindFile = function(){
        $("#container").on('click','.a-file',function(e){
            $("#fileOperation").removeAttr("hidden");
            var data_file =$(this).find('.gallery-title').text();
            $("#fileDownload").data('filename',btn_split()+data_file);
        })
    }
    bindDir();
    bindFile()

    //拼接当前所有button的路径。
    var btn_split = function(){
        var split_path = '';
        $("#catalog button").each(function(){
            split_path += $(this).data().value;
        })
        return split_path;
    }
    //禁用最后一个btn
    var btn_disabled = function(){
        $("#catalog button:last").attr('disabled','disabled')
        $("#catalog button:last").siblings().attr('disabled',false)
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
        btn_disabled();
    })
    //上传文件
    $("")
    //新建文件夹
    $("#confirm").click(function(){
        var file_name = $("#file-name").val();
        params= {};
        params.name = file_name;
        params.dir = btn_split();
        $.post('/index/Index/create',params,function(){
            $("#dirInput").addClass('hidden');
            $(".modal-backdrop").addClass('hidden');
            showFile(params.dir);

        })
    })
    //下载
    $('#fileDownload').click(function () {
        window.open('/index/Index/download?file=' + $(this).data('filename'));
    });


   $("#fileUpload").change(function(){
        var formData = new FormData($('#uploadForm')[0]);
        var url = '/index/Index/upload?path='+btn_split();
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success:function(){
               showFile(btn_split()) ;
            }
        })
    })


})