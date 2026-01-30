/**
 * Drawing Recognition Module
 * Recognizes drawn operators (<, >, =) from canvas strokes
 */

/**
 * Calculate bounding box for strokes
 * @param {Array} strokes - Array of strokes
 * @returns {Object} Bounding box {minX, minY, maxX, maxY, width, height}
 */
function getBoundingBox(strokes) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    strokes.forEach(stroke => {
        stroke.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
    });

    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
    };
}

/**
 * Analyze stroke direction
 * @param {Array} stroke - Array of points
 * @returns {Object} Direction info {angle, isHorizontal, isVertical, direction}
 */
function analyzeStrokeDirection(stroke) {
    if (stroke.length < 2) return null;

    const start = stroke[0];
    const end = stroke[stroke.length - 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const isHorizontal = Math.abs(dy) < Math.abs(dx) && Math.abs(dx) > 10;
    const isVertical = Math.abs(dx) < Math.abs(dy) && Math.abs(dy) > 10;

    let direction = null;
    if (isHorizontal) {
        direction = dx > 0 ? 'right' : 'left';
    } else if (isVertical) {
        direction = dy > 0 ? 'down' : 'up';
    }

    return { angle, isHorizontal, isVertical, direction, dx, dy };
}

/**
 * Check if point is in left/right/center region
 * @param {Object} point - Point {x, y}
 * @param {Object} bbox - Bounding box
 * @returns {string} Region ('left', 'center', 'right')
 */
function getRegion(point, bbox) {
    const relativeX = (point.x - bbox.minX) / bbox.width;
    if (relativeX < 0.33) return 'left';
    if (relativeX > 0.67) return 'right';
    return 'center';
}

/**
 * Recognize drawn operator from strokes
 * @param {Array} strokes - Array of strokes
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {string|null} Recognized operator or null
 */
export function recognizeDrawing(strokes, canvasWidth, canvasHeight) {
    if (!strokes || strokes.length === 0) return null;

    const bbox = getBoundingBox(strokes);

    // Too small to recognize
    if (bbox.width < 15 && bbox.height < 15) return null;

    // Single stroke recognition
    if (strokes.length === 1) {
        const stroke = strokes[0];
        const direction = analyzeStrokeDirection(stroke);

        if (!direction) return null;

        // Horizontal line = equal sign (single stroke)
        if (direction.isHorizontal) {
            return '=';
        }

        // Diagonal lines for < or >
        const aspectRatio = bbox.width / bbox.height;

        // Less than: stroke goes from top-left to bottom-right or bottom-left to top-right
        if (aspectRatio > 0.5) {
            const startY = stroke[0].y;
            const endY = stroke[stroke.length - 1].y;
            const startX = stroke[0].x;
            const endX = stroke[stroke.length - 1].x;

            // Left to right
            if (startX < endX) {
                // Starts high, ends low: top part of <
                if (startY < bbox.centerY && endY > bbox.centerY) {
                    return '<';
                }
                // Starts low, ends high: bottom part of <
                if (startY > bbox.centerY && endY < bbox.centerY) {
                    return '<';
                }
                // Starts high, ends low: top part of >
                if (startY < bbox.centerY && endY > bbox.centerY) {
                    return '>';
                }
            }

            // Right to left
            if (startX > endX) {
                return '<';
            }
        }
    }

    // Two strokes recognition
    if (strokes.length === 2) {
        const stroke1 = strokes[0];
        const stroke2 = strokes[1];

        const dir1 = analyzeStrokeDirection(stroke1);
        const dir2 = analyzeStrokeDirection(stroke2);

        if (!dir1 || !dir2) return null;

        // Two horizontal lines = equal sign
        if (dir1.isHorizontal && dir2.isHorizontal) {
            const verticalGap = Math.abs(stroke1[0].y - stroke2[0].y);
            if (verticalGap > 5 && verticalGap < 30) {
                return '=';
            }
        }

        // Less than (<): two diagonal strokes forming a V pointing left
        // First stroke: top-left to center, Second stroke: center to bottom-left
        const stroke1Start = stroke1[0];
        const stroke1End = stroke1[stroke1.length - 1];
        const stroke2Start = stroke2[0];
        const stroke2End = stroke2[stroke2.length - 1];

        // Check if strokes meet approximately in the middle
        const meetingPointDist = Math.sqrt(
            Math.pow(stroke1End.x - stroke2Start.x, 2) +
            Math.pow(stroke1End.y - stroke2Start.y, 2)
        );

        if (meetingPointDist < 20) {
            // Strokes meet - could be < or >
            // Determine direction by checking if the meeting point is on the left or right
            const meetingX = (stroke1End.x + stroke2Start.x) / 2;

            if (meetingX < bbox.centerX) {
                return '<';
            } else {
                return '>';
            }
        }

        // Alternative: check if one stroke goes down-left and another goes up-left
        if ((dir1.dy > 0 && dir1.dx < 0 && dir2.dy < 0 && dir2.dx < 0) ||
            (dir1.dy < 0 && dir1.dx < 0 && dir2.dy > 0 && dir2.dx < 0)) {
            return '<';
        }

        // Greater than (>): two diagonal strokes forming a V pointing right
        if ((dir1.dy > 0 && dir1.dx > 0 && dir2.dy < 0 && dir2.dx > 0) ||
            (dir1.dy < 0 && dir1.dx > 0 && dir2.dy > 0 && dir2.dx > 0)) {
            return '>';
        }
    }

    // Fallback: analyze overall shape
    const aspectRatio = bbox.width / bbox.height;

    // Wide shape = equal sign
    if (aspectRatio > 2 && bbox.height < 25) {
        return '=';
    }

    // Check general direction trend of all points
    let leftCount = 0;
    let rightCount = 0;

    strokes.forEach(stroke => {
        const start = stroke[0];
        const end = stroke[stroke.length - 1];

        if (end.x < start.x) leftCount++;
        if (end.x > start.x) rightCount++;
    });

    if (leftCount > rightCount) return '<';
    if (rightCount > leftCount) return '>';

    return null;
}
