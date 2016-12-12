// ==UserScript==
// @name         煎蛋侠
// @name:en      JiandanHero
// @name:zh-TW   煎蛋俠
// @namespace    hoothin
// @version      0.5
// @description  为煎蛋jandan.net提供左右方向键快捷翻页、鼠标悬停显示大图、屏蔽指定用户发言等功能
// @description:en  Tools for jiandan
// @description:zh-TW  為煎蛋jandan.net提供左右方向鍵快捷翻頁、鼠標懸停顯示大圖、屏蔽指定用戶發言等功能
// @author       hoothin
// @match        http*://jandan.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(e) {
        if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
        switch(e.keyCode){
            case 37://←
                var next=document.querySelector("span#nav_next>a");
                if(next)next.click();
                break;
            case 39://→
                var pre=document.querySelector("span#nav_prev>a");
                if(pre)pre.click();
                break;
        }
    });
    var authors=document.querySelectorAll("div.author"),i;
    for(i=0;i<authors.length;i++){
        let author=authors[i];
        let authorId=author.querySelector("strong").title.replace(/防伪码：/,"");
        let changeBtn=document.createElement("a");
        changeBtn.href="javascript:void(0);";
        changeBtn.id="changeBtn";
        changeBtn.style.display="none";
        author.insertBefore(changeBtn,author.querySelector("br"));
        if(GM_getValue("jandanDis_"+authorId)){
            author.nextSibling.nextSibling.style.display="none";
            changeBtn.innerHTML="显";
        }else{
            changeBtn.innerHTML="隐";
        }
        author.onmouseover=function(){
            changeBtn.style.display="block";
        };
        author.onmouseout=function(){
            changeBtn.style.display="none";
        };
        changeBtn.onclick=function(){
            var author_s,j,shown;
            if(author.nextSibling.nextSibling.style.display=="none"){
                shown=false;
                GM_deleteValue("jandanDis_"+authorId);
            }else{
                shown=true;
                GM_setValue("jandanDis_"+authorId,true);
            }
            for(j=0;j<authors.length;j++){
                author_s=authors[j];
                if(author_s.querySelector("strong").title.replace(/防伪码：/,"")==authorId){
                    author_s.nextSibling.nextSibling.style.display=shown?"none":"block";
                    author_s.querySelector("#changeBtn").innerHTML=shown?"显":"隐";
                }
            }
        };
    }
    var imgs=document.querySelectorAll("img");
    var bigImg=document.createElement("img");
    bigImg.style.cssText="pointer-events: none;position:fixed;z-index:999";
    for(i=0;i<imgs.length;i++){
        let img=imgs[i];
        img.onmouseover=function(e){
            bigImg.src=img.src.replace(/\/s\/custom\//,"/s/medium/").replace(/\.sinaimg\.cn\/mw600/,".sinaimg.cn/large");
            document.body.appendChild(bigImg);
        };
        img.onmouseout=function(e){
            document.body.removeChild(bigImg);
            bigImg.removeAttribute("height");
        };
        img.onmousemove=function(e){
            var left=e.clientX;
            var top=e.clientY;
            if(!bigImg.src || bigImg.src===""){
                img.onmouseover(null);
            }
            if(bigImg.height>document.documentElement.clientHeight){
                bigImg.height=document.documentElement.clientHeight;
            }
            if(top+bigImg.height>document.documentElement.clientHeight){
                top=document.documentElement.clientHeight-bigImg.height;
            }
            if(left+bigImg.width>document.documentElement.clientWidth){
                left=document.documentElement.clientWidth-bigImg.width;
            }
            bigImg.style.left=left+10+"px";
            bigImg.style.top=top+"px";
        };
    }
})();