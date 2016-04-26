//# sourceURL=application.js

/*
 application.js
 Sample
 
 Copyright (c) 2016 Patrick Lin. All rights reserved.
*/

/*
 * This file provides an example skeletal stub for the server-side implementation 
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is 
 * configured in the AppDelegate of the TVML application. Note that  the various 
 * javascript functions here are referenced by name in the AppDelegate. This skeletal 
 * implementation shows the basic entry points that you will want to handle 
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */

var cameras = [
    { name: 'Camera 1', eventCollection: [], status: 0 },
    { name: 'Camera 2', eventCollection: [], status: -1 },
    { name: 'Camera 3', eventCollection: [], status: 0 },
    { name: 'Camera 4', eventCollection: [], status: -1 },
    { name: 'Camera 5', eventCollection: [], status: 0 },
];

App.onLaunch = function(options) {

    var javascriptFiles = [
        `${options.BASEURL}/js/underscore-min.js`,
        `${options.BASEURL}/template/AlertTemplate.js`,
        `${options.BASEURL}/template/RPBTemplate.js`
    ];

    evaluateScripts(javascriptFiles, function(success) {

        var rpb_preview = createRPBPreview(cameras);

        navigationDocument.pushDocument(rpb_preview);

        setTimeout(function() {

            cameras[0].eventCollection = [
                { 
                    date: new Date('2016/04/26'), 
                    total_count: 200, 
                    events: 
                    [
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                    ] 
                }
            ];

            cameras[0].status = 1;

            cameras[2].eventCollection = [
                { 
                    date: new Date('2016/04/26'), 
                    total_count: 200, 
                    events: 
                    [
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                        { start_time: 12345, path: '' },
                    ] 
                }
            ];

            cameras[2].status = 1;

            cameras[4].eventCollection = [
                { 
                    date: new Date('2016/04/26'), 
                    total_count: 200, 
                    events:[]
                }
            ];

            cameras[4].status = 1;

            updateRPBSection(0);

            updateRPBSection(2);

            updateRPBSection(4);

        }, 3000);

    });

}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}

App.onWillTerminate = function() {
    
}

var replaceChilds = function(container, childs) {
    
    while (container.firstChild) {

        container.removeChild(container.firstChild);

    }

    container.innerHTML = childs.documentElement.innerHTML;

}

var updateRPBSection = function(index) {

    var sections = navigationDocument.documents[0].getElementsByTagName("section");

    var section = sections.item(index);

    replaceChilds(section, createRPBPreviewSection(cameras[index]));

    var lockupElements = section.getElementsByTagName("lockup");

    for (var i = 0; i < lockupElements.length; i++) {

        var node = lockupElements.item(i);

        setRPBPreviewListener(node);

    }

}

var setRPBPreviewListener = function(node) {

    node.addEventListener("select", function(event) {

        var selectedNode = event.target;

        if (selectedNode.getAttribute("type") == "video") {

            console.log('click video');

        }

        else if (selectedNode.getAttribute("type") == "more") {

            console.log('click rpb more');

            var index = parseInt(event.target.parentNode.getAttribute("index"));

            var rpb_more_preview = createRPBDatePreivew(index, cameras[index]);

            var lockupElements = rpb_more_preview.getElementsByTagName("lockup");

            for (var i = 0; i < lockupElements.length; i++) {

                var node = lockupElements.item(i);

                setRPBDatePreviewListener(node);

            }

            navigationDocument.pushDocument(rpb_more_preview);

        }

    });

}

var setRPBDatePreviewListener = function(node) {

    node.addEventListener("select", function(event) {

        var selectedNode = event.target;

        if (selectedNode.getAttribute("type") == "date") {

            console.log('click date');

        }

        else if (selectedNode.getAttribute("type") == "more") {

            console.log('click rpb date more');

            var selectedDate = new Date(parseInt(selectedNode.getAttribute("date")) * 1000);

            var rpb_more_preview = navigationDocument.documents[1];

            var index = rpb_more_preview.documentElement.getAttribute("camera_id");

            var rpb_date_preview_item = createRPBDatePreviewItem(selectedDate, cameras[index]);

            var lockupElements = rpb_more_preview.getElementsByTagName("lockup");

            var last_lockupElement = lockupElements.item(lockupElements.length - 11);

            var more_lockupElement = lockupElements.item(lockupElements.length - 1);

            var new_lockupElements = rpb_date_preview_item.getElementsByTagName('lockup');

            while (new_lockupElements.length > 0) {

                var new_lockupElement = new_lockupElements.item(0);

                setRPBDatePreviewListener(new_lockupElement);

                rpb_more_preview.adoptNode(new_lockupElement);

                more_lockupElement.parentNode.insertBefore(new_lockupElement, more_lockupElement);

            }

            more_lockupElement.setAttribute("date", timeintervalsince1970(getDayFromDate(selectedDate, -10)));

        }

    });    

}