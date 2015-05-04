/**
 * Created by Martin on 3.5.2015.

 * rowSelector jQuery plugin
 *
 * @author Martin Chudoba
 * @version 1.0.0
 * @returns rowSelector
 */
var rowSelector = function() {
    this.selector = null;
    this.cells = null;
    this.startCell = null;
    this.startIndex = null;
    this.line = null;
    this.state = 0;

    var isCellInLine = function(plugin, cell) {
        var result = false;
        if (plugin.line != null) {
            plugin.line.find("td").each(function () {
                if (cell.is(this)) {
                    result = true;
                }
            });
        }

        return result;
    };

    var tableOpacity = function(plugin) {
        plugin.selector.find("tr").each(function() {
            if (!plugin.line.is(this)) {
                $(this).addClass('transparent_class');
            }
        });
    };

    var reset = function(plugin) {
        plugin.selector.find("tr").removeClass('transparent_class');
        plugin.cells.removeClass("activated");
    };

    var highLine = function(plugin, stopCell, stopIndex) {
        stopCell.addClass("activated");

        plugin.line.find('td').each(function(index) {
            if ((index < stopIndex && plugin.startIndex > index) || (index > plugin.startIndex && index > stopIndex)) {
                $(this).removeClass('activated');
            } else if ((index >= stopIndex && plugin.startIndex > index) || (index <= stopIndex && plugin.startIndex < index)) {
                $(this).addClass('activated');
            }
        });
    };

    var moveCellAction = function(plugin) {
        plugin.cells.each(function() {
            $(this).off("mouseover").on("mouseover", function() {
                if (plugin.state == 1 && isCellInLine(plugin, $(this))) {
                    //$(this).addClass("activated");
                    var index = getCellIndexInRow(plugin, $(this));
                    highLine(plugin, $(this), index);
                }
            });
        });
    };

    var hoverCellAction = function(plugin) {
        plugin.cells.each(function() {
            $(this).off("click").on("click", function() {
                if (plugin.state == 0) {
                    if (plugin.startCell != null) {
                        reset(plugin);
                    }
                    plugin.cells.removeClass("activated");
                    plugin.state = 1;
                    plugin.startCell = $(this);
                    plugin.startCell.addClass("activated");
                    findRowLine(plugin);
                    tableOpacity(plugin);
                    escapeStopTheSelection(plugin);
                } else if (plugin.state == 1) {
                    if ($(this).closest("tr").css("opacity") == 1) {
                        plugin.state = 0;
                    }
                }
            });
        });
    };

    var findRowLine = function(plugin) {
        plugin.line = plugin.startCell.closest("tr");
        plugin.startIndex = getCellIndexInRow(plugin, plugin.startCell);
    };

    var getCellIndexInRow = function(plugin, cell) {
        var start = cell;
        var index = 0;

        do {
            var prev = start.prev();
            if (prev.length == 0) {
                break;
            } else {
                index++;
                start = prev;
            }
        } while (true);

        return index;
    };

    var escapeStopTheSelection = function(plugin) {
        plugin.selector.attr("tabindex", 0).css("outline", "none");
        plugin.selector.off("keydown").on("keydown", function(event) {
            if (event.keyCode == 27) {
                reset(plugin);
                plugin.state = 0;
            }
        });
    };

    this.init = function(selector) {
        this.selector = selector;
        this.cells = this.selector.find("td");
        hoverCellAction(this);
        moveCellAction(this);

        return this;
    };

};
$.rowSelector = new ($.extend(rowSelector, $.rowSelector ? $.rowSelector : {}));