/**
 * Educational Content Data
 * Contains carousel slide content and educational resources
 */

/**
 * Brief History of Fractions carousel slides
 */
export const historySlides = [
    {
        title: '🏺 Ancient Egypt (2000 BCE)',
        content: `
            <h4>🏺 Ancient Egypt (2000 BCE)</h4>
            <p>Ancient Egyptians were among the first to use fractions. They primarily used unit fractions
            (fractions with numerator 1) and had special symbols for common fractions like 1/2, 1/3, and 1/4.</p>
            <div class="timeline">
                <div class="timeline-bar">
                    <div class="timeline-item">
                        <div class="timeline-point"></div>
                        <div class="timeline-label">2000 BCE<br>Egyptian Fractions</div>
                    </div>
                </div>
            </div>
        `
    },
    {
        title: '🏛️ Ancient Greece (500 BCE)',
        content: `
            <h4>🏛️ Ancient Greece (500 BCE)</h4>
            <p>Greek mathematicians like Pythagoras developed more sophisticated fraction concepts.
            They explored the relationship between fractions and ratios in geometry and music.</p>
            <p>The Greeks used fractions to describe musical intervals and proportions in architecture.</p>
        `
    },
    {
        title: '🕌 Islamic Golden Age (800-1200 CE)',
        content: `
            <h4>🕌 Islamic Golden Age (800-1200 CE)</h4>
            <p>Islamic mathematicians like Al-Khwarizmi standardized fraction notation and operations.
            They introduced decimal fractions and advanced algebraic techniques for working with fractions.</p>
            <div class="example-box">
                <strong>Example:</strong> Al-Khwarizmi's work on fractions influenced European mathematics
                for centuries.
            </div>
        `
    },
    {
        title: '📜 Medieval Europe (1200-1500 CE)',
        content: `
            <h4>📜 Medieval Europe (1200-1500 CE)</h4>
            <p>Leonardo Fibonacci introduced Hindu-Arabic numerals and fractions to Europe through his
            book "Liber Abaci" (1202). This revolutionized European mathematics and commerce.</p>
            <p>The modern fraction bar notation (/) gradually replaced various older notations.</p>
        `
    },
    {
        title: '🔢 Modern Era (1500-Present)',
        content: `
            <h4>🔢 Modern Era (1500-Present)</h4>
            <p>Fractions became standardized with the horizontal bar notation we use today.
            Decimal fractions were developed, and fraction arithmetic became essential for science,
            engineering, and everyday calculations.</p>
            <p>Today, fractions are a fundamental part of mathematics education worldwide!</p>
        `
    }
];

/**
 * Comparison Strategies carousel slides
 */
export const strategiesSlides = [
    {
        title: '1️⃣ Common Denominators',
        content: `
            <h4>Strategy 1: Common Denominators</h4>
            <div class="strategy-box">
                <p><strong>When to use:</strong> When fractions have different denominators</p>
                <p><strong>How it works:</strong> Convert both fractions to have the same denominator,
                then compare numerators.</p>
            </div>
            <div class="example-box">
                <strong>Example:</strong> Compare 1/3 and 1/4<br>
                • Convert to common denominator (12): 4/12 and 3/12<br>
                • Compare numerators: 4 > 3, so 1/3 > 1/4
            </div>
        `
    },
    {
        title: '2️⃣ Cross Multiplication',
        content: `
            <h4>Strategy 2: Cross Multiplication</h4>
            <div class="strategy-box">
                <p><strong>When to use:</strong> Quick comparison without finding common denominator</p>
                <p><strong>How it works:</strong> Multiply numerator of first fraction by denominator
                of second, and vice versa. Compare the products.</p>
            </div>
            <div class="example-box">
                <strong>Example:</strong> Compare 2/5 and 3/7<br>
                • 2 × 7 = 14<br>
                • 3 × 5 = 15<br>
                • 14 < 15, so 2/5 < 3/7
            </div>
        `
    },
    {
        title: '3️⃣ Benchmark Fractions',
        content: `
            <h4>Strategy 3: Use Benchmark Fractions</h4>
            <div class="strategy-box">
                <p><strong>When to use:</strong> When fractions are close to common benchmarks like 0, 1/2, or 1</p>
                <p><strong>How it works:</strong> Compare each fraction to 1/2 or other benchmarks.</p>
            </div>
            <div class="example-box">
                <strong>Example:</strong> Compare 3/7 and 5/8<br>
                • 3/7 is less than 1/2 (because 3.5/7 = 1/2)<br>
                • 5/8 is more than 1/2 (because 4/8 = 1/2)<br>
                • Therefore, 3/7 < 5/8
            </div>
        `
    },
    {
        title: '4️⃣ Unit Fractions',
        content: `
            <h4>Strategy 4: Unit Fractions (Numerator = 1)</h4>
            <div class="strategy-box">
                <p><strong>When to use:</strong> When comparing fractions with numerator 1</p>
                <p><strong>Key insight:</strong> The larger the denominator, the smaller the fraction!</p>
            </div>
            <div class="example-box">
                <strong>Example:</strong> Compare 1/8 and 1/5<br>
                • 8 > 5 (denominators)<br>
                • Therefore: 1/8 < 1/5<br>
                • (More pieces means smaller pieces!)
            </div>
        `
    },
    {
        title: '5️⃣ Visual Representation',
        content: `
            <h4>Strategy 5: Visual Representation</h4>
            <div class="strategy-box">
                <p><strong>When to use:</strong> When you want to understand fraction size intuitively</p>
                <p><strong>How it works:</strong> Draw or imagine visual models (like pizza slices)
                to see which fraction is larger.</p>
            </div>
            <div class="visual-fraction-demo">
                <div class="fraction-bar">
                    <div class="fraction-part filled"></div>
                    <div class="fraction-part filled"></div>
                    <div class="fraction-part filled"></div>
                    <div class="fraction-part"></div>
                </div>
                <span style="font-size: 1.5em; margin: 0 20px;">vs</span>
                <div class="fraction-bar">
                    <div class="fraction-part filled"></div>
                    <div class="fraction-part filled"></div>
                    <div class="fraction-part"></div>
                    <div class="fraction-part"></div>
                </div>
            </div>
            <p style="text-align: center; margin-top: 10px;">3/4 > 2/4 (visual comparison)</p>
        `
    }
];

/**
 * Common Misconceptions carousel slides
 */
export const misconceptionsSlides = [
    {
        title: '❌ Bigger Denominator = Bigger Fraction',
        content: `
            <h4>Misconception 1: Bigger Denominator = Bigger Fraction</h4>
            <div class="strategy-box">
                <p><strong>The mistake:</strong> Thinking 1/8 > 1/4 because 8 > 4</p>
                <p><strong>Why it's wrong:</strong> Larger denominator means MORE pieces, which makes each
                piece SMALLER.</p>
                <p><strong>Remember:</strong> For unit fractions (numerator = 1), larger denominator = smaller fraction!</p>
            </div>
            <div class="example-box">
                Think of pizza: 1 slice from an 8-slice pizza is smaller than 1 slice from a 4-slice pizza!
            </div>
        `
    },
    {
        title: '❌ Compare Numerators Only',
        content: `
            <h4>Misconception 2: Just Compare Numerators</h4>
            <div class="strategy-box">
                <p><strong>The mistake:</strong> Thinking 3/8 > 2/3 because 3 > 2</p>
                <p><strong>Why it's wrong:</strong> You must consider BOTH numerator and denominator.
                2/3 is actually larger than 3/8.</p>
                <p><strong>Remember:</strong> The denominator tells you the size of each piece!</p>
            </div>
            <div class="example-box">
                <strong>Correct comparison:</strong><br>
                3/8 = 0.375<br>
                2/3 ≈ 0.667<br>
                Therefore: 3/8 < 2/3
            </div>
        `
    },
    {
        title: '❌ Both Numbers Bigger = Fraction Bigger',
        content: `
            <h4>Misconception 3: Both Numbers Bigger = Fraction Bigger</h4>
            <div class="strategy-box">
                <p><strong>The mistake:</strong> Thinking 7/10 > 2/3 because both 7 and 10 are larger</p>
                <p><strong>Why it's wrong:</strong> What matters is the RATIO, not the individual numbers.</p>
                <p><strong>Remember:</strong> Compare the actual fraction values!</p>
            </div>
            <div class="example-box">
                <strong>Correct comparison:</strong><br>
                7/10 = 0.7<br>
                2/3 ≈ 0.667<br>
                Therefore: 7/10 > 2/3 (but it's close!)
            </div>
        `
    },
    {
        title: '❌ Fractions Near 1 Are Hard',
        content: `
            <h4>Misconception 4: Fractions Close to 1 Are Confusing</h4>
            <div class="strategy-box">
                <p><strong>The mistake:</strong> Struggling to compare 5/6 and 7/8</p>
                <p><strong>Better approach:</strong> See how far each fraction is from 1 whole.</p>
                <p><strong>Remember:</strong> Subtract from 1 to see the "gap"!</p>
            </div>
            <div class="example-box">
                <strong>Compare using gaps:</strong><br>
                5/6 is missing 1/6 from whole<br>
                7/8 is missing 1/8 from whole<br>
                1/8 < 1/6, so 7/8 is closer to 1<br>
                Therefore: 7/8 > 5/6
            </div>
        `
    },
    {
        title: '❌ Equivalent Fractions Look Different',
        content: `
            <h4>Misconception 5: Different-Looking Fractions Can't Be Equal</h4>
            <div class="strategy-box">
                <p><strong>The mistake:</strong> Thinking 2/4 and 1/2 are different because the numbers are different</p>
                <p><strong>Why it's wrong:</strong> Equivalent fractions represent the same value.</p>
                <p><strong>Remember:</strong> Simplify fractions to see if they're equivalent!</p>
            </div>
            <div class="simplification-steps">
                <div class="step">2/4 = (2÷2) / (4÷2) = 1/2</div>
                <div class="step">3/6 = (3÷3) / (6÷3) = 1/2</div>
                <div class="step">All these equal 0.5!</div>
            </div>
        `
    }
];
