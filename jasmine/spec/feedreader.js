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
                    expect(feed.name).not.toBe(empty[i]);
                }
            });
        });
    });

    describe('The menu', function () {

        const menuHiddenClass = 'menu-hidden';

        /* This test checking the default state of the menu */
        it('checking the default state of the menu', function () {
            let hasTargetClass = checkTargetClass();
            let transform = getTransform('.slide-menu');
            expect(hasTargetClass).toEqual(true);
            expect(transform).toContain(-192);
        });

        /* This test checking states of the menu by click */
        it('checking the states of the menu by click', function () {
            let hasTargetClass = checkTargetClass();
            expect(hasTargetClass).toEqual(true);
            clickOnMenu();
            hasTargetClass = checkTargetClass();
            expect(hasTargetClass).toEqual(false);
            clickOnMenu();
            hasTargetClass = checkTargetClass();
            expect(hasTargetClass).toEqual(true);
        });

        /**
         * Check body class
         * @returns {boolean}
         */
        function checkTargetClass() {
            return $('body').hasClass(menuHiddenClass);
        }

        /**
         * Click on the menu
         */
        function clickOnMenu() {
            $('.menu-icon-link').click();
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
            return [parseInt(x), parseInt(y)];
        }
    });

    describe('Initial Entries', function () {
        beforeEach(done => loadFeed(0, done));

        it('checking the feed container', function () {
            const entry = $('.feed .entry').length;
            expect(entry).toBeGreaterThan(0);
        });
    });

    describe('New Feed Selection', function () {
        let firstContent = null;
        let secondContent = null;

        beforeEach(function (done) {
            // Load the first contents
            loadFeed(0, function () {
                firstContent = $('.feed').contents();
                // Load the second contents
                loadFeed(1, function () {
                    secondContent = $('.feed').contents();
                    done();
                });
            });
        });

        it('checking feed`s content', function (done) {
            let contentDiff = false;
            if (firstContent.length !== secondContent.length) {
                contentDiff = true;
            }

            if (contentDiff === false) {
                let firstContentLinks = firstContent.filter('a');
                let secondContentLinks = secondContent.filter('a');
                let length = Math.min(firstContentLinks.length, secondContentLinks.length);
                for (let i = 0; i < length; i++) {
                    let firstLink = $(firstContentLinks[i]).attr('href');
                    let secondLink = $(secondContentLinks[i]).attr('href');
                    if (firstLink !== secondLink) {
                        contentDiff = true;
                        break;
                    }
                }
            }
            expect(contentDiff).toBe(true);
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
