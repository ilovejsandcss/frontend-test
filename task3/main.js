window.onload = function () {
    var apiResolver = (function () {
        var self = {};
        var _content = {};
        var get = function(url) {
            return new Promise(function(success, fail) {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);

                request.addEventListener('load', function() {
                    if (request.status < 400) {
                        success(request.response);
                    } else {
                        fail(request.error);
                    }
                });

                request.addEventListener('error', function() {
                    fail(new Error('Network error'));
                })


                request.send();
            })
        };

        var _getAllPosts = function () {
            get('https://jsonplaceholder.typicode.com/posts/')
                .then(function(data){
                    _content = JSON.parse(data);
                    var wrapper = document.getElementById('content-wrapper');
                    for (var i =0; i < _content.length; i++) {
                        (function (a) {
                            var content = _content[a];

                            var elem = document.createElement('article');
                            elem.classList.add('item-single');
                            elem.setAttribute('id', 'elem' + content.id);

                            var link = document.createElement('a');
                            link.classList.add('item-single-link');
                            link.setAttribute('href', 'javascript:;');
                            link.innerHTML = 'See more';
                            elem.appendChild(link);

                            var heading = document.createElement('h2');
                            heading.classList.add('item-single__heading');
                            heading.innerHTML = content.title;
                            elem.appendChild(heading);

                            var p = document.createElement('p');
                            p.classList.add('item-single__desc');
                            p.innerHTML = content.body;
                            elem.appendChild(p);

                            var commH = document.createElement('a');
                            commH.classList.add('item-single__comments-heading');
                            commH.innerHTML = ' comments';
                            commH.setAttribute('href', 'javascript:;');
                            elem.appendChild(commH);

                            var commList = document.createElement('ul');
                            commList.classList.add('item-single__comments');
                            commList.setAttribute('id', 'commlist-' + content.id);
                            elem.appendChild(commList);

                            wrapper.appendChild(elem);

                        })(i)
                    }

                    get('https://jsonplaceholder.typicode.com/posts/0/comments')
                        .then(function(response) {
                            var data = JSON.parse(response);
                            for (var i = 0; i< data.length; i++) {
                                (function (a) {
                                    var content = data[a];
                                    var container = document.getElementById('commlist-' + content.postId);
                                    var li = document.createElement('li');
                                    li.classList.add('item-single-comment');
                                    var header = document.createElement('h3');
                                    header.innerHTML = content.name;
                                    header.classList.add('item-single-comment__heading');
                                    li.appendChild(header);
                                    var aside = document.createElement('aside');
                                    aside.classList.add('item-single-comment__email');
                                    aside.innerHTML = content.email;
                                    li.appendChild(aside);
                                    var p = document.createElement('p');
                                    p.classList.add('item-single-comment__body');
                                    p.innerHTML = content.body;
                                    li.appendChild(p);
                                    container.appendChild(li);
                                })(i);
                            }
                        }, function(err) {
                            console.log(err);
                        });
                }, function(err) {
                    console.log(err);
                });

        };


        self.init = function () {
            _getAllPosts();
        };

        self.init();
        return self;
    })();

    var modalService = (function(){
        var obj = {};

        var modal = document.getElementById('modal');
        var contentWrapper = modal.querySelector('.modal-content');

        obj.build = function(content) {
            contentWrapper.innerHTML = '';
            contentWrapper.append(content);
            modal.classList.add('open');
        };

        obj.close = function() {
            modal.classList.remove('open');
            contentWrapper.innerHTML = '';
        };

        return obj;
    })();

    document.addEventListener('click', function(e) {
        var target = e.target;
        if (target.classList.contains('item-single__comments-heading')) {
            e.preventDefault();
            target.classList.toggle('open');
            return false;
        } else if (target.classList.contains('item-single-link')) {
            var parent = target.parentNode;
            var content = parent.cloneNode(true);
            e.preventDefault();
            modalService.build(content);
            return false;
        } else if (target.classList.contains('modal-backdrop') || target.classList.contains('modal-close')) {
            e.preventDefault();
            modalService.close();
            return false;
        }
    }, false);
};

