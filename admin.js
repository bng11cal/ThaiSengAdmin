var myApp = angular.module('myApp', ['ng-admin']);

const baseApiUrl = 'http://192.168.1.18:3000/api/';
function capitalize(value, entry) {
    if (value) {
        return value.substr(0,1).toUpperCase() + value.substr(1).toLowerCase();
    } else return value;
}

function displayGrapeVarieties(value, entry) {
    if (value) {
        return value.toString();
    } else return value;
}

myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Thai Seng Admin Portal')
      .baseApiUrl(baseApiUrl); // main API endpoint

    // create a product entity
    // the API endpoint for this entity will be 'http://localhost:3000/api/products/:id' 
    var product = nga.entity('products')
        .identifier(nga.field('_id'));

    // set the fields of the product entity list view
    product.listView().title('Products')
        .fields([
            nga.field('name').isDetailLink(true).detailLinkRoute('show'),
            nga.field('type'),
            nga.field('country'),
            nga.field('company'),
            nga.field('unitPrice').label('Price/Unit'),
            nga.field('unitVol').label('Unit Volume'),
            //nga.field('description'),
            //nga.field('percentAlcohol'),
            //nga.field('packages'),
            //nga.field('grapeVarieties'),
            //nga.field('vintage'),
            //nga.field('imageURL'),
            nga.field('dateAdded', 'date')
        ])
        .listActions(['edit'])
        .filters([
            nga.field('q')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('type', 'choice')
                .choices([
                    {value: 'Wine', label: 'Wine'},
                    {value: 'Vodka', label: 'Vodka'},
                    {value: 'Brandy', label: 'Brandy'},
                    {value: 'Whisky', label: 'Whisky'},
                    {value: 'Tequila', label: 'Tequila'},
                ]),
            nga.field('country'),
            nga.field('company'),
            nga.field('label'),
            nga.field('vintage'),
            nga.field('status', 'choice')
                .choices([
                    {value: 'Available', label: 'Available'},
                    {value: 'Out of Stock', label: 'Out of Stock'},
                    {value: 'Unavailable', label: 'Unavailable'},
                    {value: 'Limited Edition', label: 'Limited Edition'}
                ])
        ]).sortField('name').sortDir('ASC');

    product.showView().title('Details: {{entry.values.name}}').fields([
        nga.field('name'),
        nga.field('type'),
        nga.field('country'),
        nga.field('company'),
        nga.field('unitPrice')
            .label('Price/Unit'),
        nga.field('unitVol')
            .label('Unit Volume'),
        nga.field('description'),
        nga.field('percentAlcohol')
            .label('% Alcohol'),
        nga.field('packages', 'embedded_list')
            .targetFields([
                nga.field('volume').label('Unit Volume (mL)'),
                nga.field('count').label('Number of Units'),
                nga.field('price').label('Total Price')
            ]),
        nga.field('specials'),
        nga.field('grapeVarieties')
            .label('Grape Varieties')
            .map(displayGrapeVarieties),
        nga.field('vintage'),
        nga.field('label'),
        nga.field('imageURL')
            .label('Image URL'),
        nga.field('dateAdded', 'date')
            .label('Date Added'),
    ]);

    product.creationView().fields([
        nga.field('name')
            .attributes({placeholder: 'Ex: "Choya Umeshu Honey"'}),
        nga.field('type', 'choice')
            .choices([
                {value: 'Wine', label: 'Wine'},
                {value: 'Vodka', label: 'Vodka'},
                {value: 'Brandy', label: 'Brandy'},
                {value: 'Whisky', label: 'Whisky'},
                {value: 'Tequila', label: 'Tequila'},
                {value: 'Cognac', label: 'Cognac'},
                {value: 'Gin', label: 'Gin'},
                {value: 'Rum', label: 'Rum'},
                {value: 'Armagnac', label: 'Armagnac'},
                {value: 'French Brandy', label: 'French Brandy'},
                {value: 'Herbal Wine', label: 'Herbal Wine'},
                {value: 'Sparkling Wine', label: 'Sparkling Wine'},
                {value: 'Rice Wine', label: 'Rice Wine'}
            ]),
        nga.field('country')
            .attributes({placeholder: 'Ex: "Japan"'})
            .transform(capitalize),
        nga.field('company')
            .attributes({placeholder: 'Ex: "Choya"'})
            .transform(capitalize),
        nga.field('unitPrice', 'float')
            .label('Price(RM)/Unit')
            .attributes({placeholder: 'Price for one item. Ex: "40"'}),
        nga.field('unitVol', 'number')
            .label('Volume(mL)/Unit')
            .attributes({placeholder: 'Item volume. Ex: "750"'}),
        nga.field('description')
            .attributes({placeholder: 'A detailed description of the product.'}),
        nga.field('percentAlcohol', 'number')
            .label('Alcohol %')
            .attributes({placeholder: 'Ex: "15"'}),
        nga.field('image', 'file')
            .uploadInformation({'url': baseApiUrl + "products/images/"}),
        nga.field('packages'),
        nga.field('grapeVarieties')
            .label('Grape Varieties')
            .attributes({placeholder: 'For wine only. Enter each grape, separated by a comma. Ex: "Merlot,Chardonnay,Colombard"'})
            .transform(function(value, entry) {
                if (value instanceof String) {
                    return value.split(",");
                } else return value;
            }),
        nga.field('vintage')
            .attributes({placeholder: 'For wine only. Ex: "1997"'}),
        nga.field('label')
            .attributes({placeholder: 'For brandy or whiskey only. Ex: "VSOP"'})
            .transform(capitalize),
        nga.field('status', 'choice')
            .choices([
                {value: 'Available', label: 'Available'},
                {value: 'Out of Stock', label: 'Out of Stock'},
                {value: 'Unavailable', label: 'Unavailable'},
                {value: 'Limited Edition', label: 'Limited Edition'}
            ]),
        nga.field('imageURL')
            .template('<upload-image post="entry"></upload-image>'),
        nga.field('dateAdded', 'date')
            .label('Date Added To Warehouse'),
    ])

    product.editionView().title('Edit Product: {{entry.values.name}}')
        .fields(product.creationView().fields())

    // add the user entity to the admin application
    admin.addEntity(product);
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

var uploadImageTemplate = 
    '<div class="row"><div class="col-lg-12">' +
        '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
        '<div class="page-header">' +
            '<h1>Upload Image</h1>' + 
        '</div>' +
    '</div><div>';

myApp.config(function ($stateProvider) {
    $stateProvider.state('uploadImage', {
        parent: 'main',
        url: '/upload',
        template: uploadImageTemplate,
        controller: imageUploadController,
        controllerAs: 'controller'
    });
});

myApp.directive('uploadImage', ['$location', function($location) {
    return {
        restrict: 'E',
        scope: { post: '&'},
        link: function (scope) {
            scope.send = function() {
                $location.path('/upload');
            };
        },
        template: '<a class="btn btn-default" ng-click="send()">test</a>'
    };
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params.limit = params._perPage;
                params.page = params._page;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                params.sortBy = params._sortField;
                params.ascending = "false";
                if (params._sortDir == "ASC") params.ascending = "true";
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                for (var filter in params._filters) {
                    if (filter == 'q')
                        params[filter] = params._filters[filter];
                    else
                        params.filterKey = filter;
                        params.filterVal = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);