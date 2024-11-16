function determineRole(role) {
    if (typeof role !== 'string' || !role) {
        console.error('Invalid role:', role);
        return 0; // Return 0 if role is not a valid string
    }

    // Define a mapping of role substrings to their rank values
    const roleRankMap = {
        'software engineer': 1,
        'data scientist': 1,
        'product manager': 1,
        'project manager': 1,
        'devops': 1,
        'designer': 1,
        'qa tester': 1,
        'admin': 2,
        'ceo': 3,
        'business analyst': 1,
        'marketing specialist': 1,
        'tester': 1,
    };

    // Convert the input role to lowercase for case-insensitive matching
    const lowerCaseRole = role.toLowerCase();

    // Loop through the roleRankMap to find a matching substring
    for (const key in roleRankMap) {
        if (lowerCaseRole.includes(key)) {
            return roleRankMap[key];
        }
    }
    // Default value if no match is found
    return 0;
}

export default determineRole;
