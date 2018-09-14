/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function () {
        const empty = [undefined, null, ''];

        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty.
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* This test checking urls of feeds */
        it('checking urls of feeds', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                for (let i in empty) {
                    expect(feed.url).not.toBe(empty[i]);
                }
            });
        });

        /* This test checking names of feeds */
        it('checking names of feeds', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                for (let i in empty) {
                    expect(feed.url).not.toBe(empty[i]);
                }
            });
        });
    });

    describe('The menu', function () {

        const menuHiddenClass = 'menu-hidden';

        /* This test checking the default state of the menu */
        it('checking the default state of the menu', function () {
            const className = getBodyClass();
            const transform = getTransform('.slide-menu');
            expect(className).toEqual(menuHiddenClass);
            expect(transform).toContain(-192);
        });

        /* This test checking states of the menu by click */
        it('checking the states of the menu by click', function () {
            let className = getBodyClass();
            expect(className).toEqual(menuHiddenClass);
            clickOnMenu();
            className = getBodyClass();
            expect(className).toBe('');
            clickOnMenu();
            className = getBodyClass();
            expect(className).toEqual(menuHiddenClass);
        });

        /**
         * Gets body class
         * @returns {string}
         */
        function getBodyClass() {
            return $('body').attr('class');
        }

        /**
         * Click on the menu
         */
        function clickOnMenu() {
            $('.menu-icon-link').trigger('click');
        }

        /**
         * Gets transform data
         * @param {string} el
         * @returns {int[]}
         */
        function getTransform(el) {
            const matrix = $(el).css('transform').replace(/[^0-9\-.,]/g, '').split(',');
            const x = matrix[12] || matrix[4];
            const y = matrix[13] || matrix[5];
            return [parseInt(x), parseInt(y)]
        }
    });

    describe('Initial Entries', function () {
        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        });

        it('checking the feed container', function (done) {
            const entry = $('.feed .entry').length;
            expect(entry).toBeGreaterThan(0);
            done();
        });
    });

    describe('New Feed Selection', function () {
        let feedNumber = 0;
        beforeEach(function (done) {
            loadFeed(feedNumber, function () {
                done();
            });
        });

        afterEach(function () {
            feedNumber++;
        });

        it('checking the feed with index 0', function (done) {
            const entryLink = $('.feed .entry-link').get(0);
            expect($(entryLink).attr('href').indexOf('http://blog.udacity.com/')).not.toBe(-1);
            done();
        });

        it('checking the feed with index 1', function (done) {
            const entryLink = $('.feed .entry-link').get(0);
            expect($(entryLink).attr('href').indexOf('https://css-tricks.com/')).not.toBe(-1);
            done();
        });
    });

    describe('Exceptions', function () {
        it('Feed`s id was not defined', function () {
            expect(loadFeed).toThrowError(Error, 'Feed`s id was not defined');
        });

        it('Feed was not found', function () {
            const result = {
                test: function () {
                    loadFeed(1000000);
                }
            };
            expect(result.test).toThrowError(Error, 'Feed was not found');
        });
    });
}());
