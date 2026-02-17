//service for code execution
// Using Judge0's free open instance
const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_VERSIONS = {
    javascript: { id: 63 },  // Node.js 12.14.0
    python: { id: 71 },      // Python 3.8.1
    java: { id: 62 },        // Java 13.0.1
};

function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(str) {
    if (!str) return "";
    return decodeURIComponent(escape(atob(str)));
}

export async function executeCode(language, code) {
    try {
        const languageConfig = LANGUAGE_VERSIONS[language];

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language: ${language}`,
            };
        }

        // Step 1: Submit code
        const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=true&wait=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language_id: languageConfig.id,
                source_code: encodeBase64(code),
            }),
        });

        if (!submitResponse.ok) {
            return {
                success: false,
                error: `Submission failed: ${submitResponse.status}`,
            };
        }

        const { token } = await submitResponse.json();

        // Step 2: Poll for result
        let result = null;
        for (let i = 0; i < 10; i++) {
            await new Promise((res) => setTimeout(res, 1500));

            const resultResponse = await fetch(
                `${JUDGE0_API}/submissions/${token}?base64_encoded=true`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            result = await resultResponse.json();

            if (result.status.id !== 1 && result.status.id !== 2) {
                break;
            }
        }

        if (!result) {
            return { success: false, error: "Execution timed out" };
        }

        const stdout = decodeBase64(result.stdout);
        const stderr = decodeBase64(result.stderr);
        const compileOutput = decodeBase64(result.compile_output);

        if (stderr) {
            return { success: false, error: stderr, output: stdout };
        }

        if (compileOutput) {
            return { success: false, error: compileOutput };
        }

        return {
            success: true,
            output: stdout || "No output",
        };

    } catch (error) {
        return {
            success: false,
            error: `Failed to execute code: ${error.message}`,
        };
    }
}


