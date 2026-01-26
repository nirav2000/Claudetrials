/**
 * Educational Content Data
 * Contains carousel slide content and educational resources
 */

/**
 * Brief History of Fractions carousel slides
 */
export const historySlides = [
    {
        title: '📅 Timeline Introduction',
        content: `
            <h4>📅 Timeline Introduction</h4>
            <p><strong>Fractions have been used for over 5,000 years!</strong> Let's see how far back 3000 BC really is compared to when you, your parents, and grandparents were born:</p>

            <div style="background: linear-gradient(to right, #E8EAF6, #C5CAE9); border-radius: 8px; padding: 30px 20px; margin: 30px 0;">
                <div style="text-align: center; font-size: 0.85em; color: #666; margin-bottom: 15px;">
                    Timeline divided into 5 segments of ~1000 years each for accurate placement
                </div>

                <div style="position: relative; height: 120px; margin-bottom: 30px;">
                    <div style="position: absolute; top: 50px; left: 0; right: 0; height: 8px; display: flex;">
                        <div style="flex: 1; background: #673AB7; border-right: 2px solid white;"></div>
                        <div style="flex: 1; background: #512DA8; border-right: 2px solid white;"></div>
                        <div style="flex: 1; background: #4527A0; border-right: 2px solid white;"></div>
                        <div style="flex: 1; background: #311B92; border-right: 2px solid white;"></div>
                        <div style="flex: 1.026; background: linear-gradient(to right, #1A237E, #03DAC6);"></div>
                    </div>

                    <div style="position: absolute; left: 0%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600;">
                        3000 BC
                    </div>
                    <div style="position: absolute; left: 19.9%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600; transform: translateX(-50%);">
                        2000 BC
                    </div>
                    <div style="position: absolute; left: 39.8%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600; transform: translateX(-50%);">
                        1000 BC
                    </div>
                    <div style="position: absolute; left: 59.7%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600; transform: translateX(-50%);">
                        0 AD
                    </div>
                    <div style="position: absolute; left: 79.6%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600; transform: translateX(-50%);">
                        1000 AD
                    </div>
                    <div style="position: absolute; right: 0%; top: 65px; font-size: 0.65em; color: #666; font-weight: 600;">
                        2026 AD
                    </div>

                    <div style="position: absolute; left: 0%; top: 50px; transform: translate(0, -50%);">
                        <div style="width: 16px; height: 16px; background: white; border: 3px solid #6200EA; border-radius: 50%; margin: 0 auto;"></div>
                        <div style="margin-top: -75px; text-align: center; font-size: 0.75em; font-weight: 600;">
                            <div style="font-size: 1.5em;">📜</div>
                            Egypt
                        </div>
                    </div>

                    <div style="position: absolute; left: 47.8%; top: 50px; transform: translate(-50%, -50%);">
                        <div style="width: 16px; height: 16px; background: white; border: 3px solid #6200EA; border-radius: 50%; margin: 0 auto;"></div>
                        <div style="margin-top: 15px; text-align: center; font-size: 0.75em; font-weight: 600;">
                            <div style="font-size: 1.5em;">🕉️</div>
                            India<br>
                            <span style="font-size: 0.9em;">600 BC</span>
                        </div>
                    </div>

                    <div style="position: absolute; left: 89.5%; top: 50px; transform: translate(-50%, -50%);">
                        <div style="width: 16px; height: 16px; background: white; border: 3px solid #6200EA; border-radius: 50%; margin: 0 auto;"></div>
                        <div style="margin-top: -75px; text-align: center; font-size: 0.75em; font-weight: 600;">
                            <div style="font-size: 1.5em;">📐</div>
                            Modern<br>
                            <span style="font-size: 0.9em;">1500 AD</span>
                        </div>
                    </div>

                    <div style="position: absolute; right: 0%; top: 50px; transform: translate(0, -50%);">
                        <div style="width: 20px; height: 20px; background: #03DAC6; border: 3px solid #6200EA; border-radius: 50%; margin: 0 auto; box-shadow: 0 0 10px rgba(3, 218, 198, 0.5);"></div>
                        <div style="margin-top: 15px; text-align: center; font-size: 0.8em; font-weight: 700; color: #6200EA;">
                            <div style="font-size: 1.8em;">⭐</div>
                            TODAY!
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-around; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="text-align: center; padding: 10px;">
                        <div style="width: 12px; height: 12px; background: white; border: 2px solid #FF9800; border-radius: 50%; margin: 0 auto 8px;"></div>
                        <div style="font-size: 0.75em; font-weight: 600; color: #F57C00;">
                            1950<br>
                            <span style="font-size: 1.8em;">👵🏽👴🏽</span><br>
                            Grandparents
                        </div>
                    </div>

                    <div style="font-size: 1.5em; color: #999;">→</div>

                    <div style="text-align: center; padding: 10px;">
                        <div style="width: 12px; height: 12px; background: white; border: 2px solid #4CAF50; border-radius: 50%; margin: 0 auto 8px;"></div>
                        <div style="font-size: 0.75em; font-weight: 600; color: #2E7D32;">
                            1980<br>
                            <span style="font-size: 1.8em;">👨🏽👩🏽</span><br>
                            Parents
                        </div>
                    </div>

                    <div style="font-size: 1.5em; color: #999;">→</div>

                    <div style="text-align: center; padding: 10px;">
                        <div style="width: 12px; height: 12px; background: white; border: 2px solid #2196F3; border-radius: 50%; margin: 0 auto 8px;"></div>
                        <div style="font-size: 0.75em; font-weight: 600; color: #1565C0;">
                            2016<br>
                            <span style="font-size: 1.8em;">🧒🏽</span><br>
                            You (9 yrs)
                        </div>
                    </div>

                    <div style="font-size: 1.5em; color: #999;">→</div>

                    <div style="text-align: center; padding: 10px;">
                        <div style="width: 14px; height: 14px; background: #03DAC6; border: 2px solid #6200EA; border-radius: 50%; margin: 0 auto 8px;"></div>
                        <div style="font-size: 0.75em; font-weight: 700; color: #6200EA;">
                            2026<br>
                            <span style="font-size: 1.8em;">⭐</span><br>
                            Today!
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 15px; font-size: 0.85em; color: #666;">
                    These 76 years represent only <strong>1.5%</strong> of the 5,026-year timeline above!
                </div>
            </div>

            <p style="margin-top: 20px; font-size: 0.95em; color: #666;">
                <strong>💡 Scale Perspective:</strong> This timeline is drawn to scale! The top bar shows 5,026 years from 3000 BC to 2026 AD.
                Notice how ALL of modern history (grandparents, parents, you) is squeezed into the tiniest space at the right end - that's why we created the zoom box below to see it clearly!
            </p>
        `
    },
    {
        title: '🏺 Ancient Egypt (2000 BCE)',
        content: `
            <h4>🏺 Ancient Egypt (2000 BCE)</h4>
            <p>Ancient Egyptians were among the first to use fractions. They primarily used unit fractions
            (fractions with numerator 1) and had special symbols for common fractions like 1/2, 1/3, and 1/4.</p>
            <div class="example-box">
                <strong>Egyptian Hieroglyphs:</strong> They used the Eye of Horus symbol to represent fractions!
                Different parts of the eye represented different fractions: 1/2, 1/4, 1/8, 1/16, 1/32, and 1/64.
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
                Think of pizza: 1 slice from an 8-slice pizza is smaller than 1 slice from a 4-slice pizza! 🍕
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
