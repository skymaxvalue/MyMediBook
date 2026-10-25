(function () {

    const SESSION_KEY = "hhSession";
    const PENDING_KEY = "pendingUser";
    const LOGIN_PAGE = "login.html";

    const ACCOUNTS = {
        "1024": {
            role: "frontoffice",
            name: "Front Office",
            title: "Front Office",
            home: "dashboard.html"
        },
        "DOC1001": {
            role: "doctor",
            name: "Dr. Alex",
            title: "Doctor",
            home: "doctor-dashboard.html"
        }
    };

    function lookup(id) {

        if (typeof id !== "string") {
            return null;
        }

        const key = id.trim().toUpperCase();

        if (!Object.prototype.hasOwnProperty.call(ACCOUNTS, key)) {
            return null;
        }

        return Object.assign({ id: key }, ACCOUNTS[key]);

    }

    function establishSession() {

        const account = lookup(localStorage.getItem(PENDING_KEY));

        if (!account) {
            return null;
        }

        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ employeeId: account.id })
        );

        localStorage.removeItem(PENDING_KEY);

        return account.home;

    }

    function getSession() {

        let stored = null;

        try {
            stored = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        }
        catch (error) {
            return null;
        }

        if (!stored) {
            return null;
        }

        const account = lookup(stored.employeeId);

        if (!account) {
            return null;
        }

        return {
            employeeId: account.id,
            role: account.role,
            name: account.name,
            title: account.title,
            home: account.home
        };

    }

    function requireRole(role) {

        const session = getSession();

        if (!session) {
            window.location.replace(LOGIN_PAGE);
            return null;
        }

        if (session.role !== role) {
            window.location.replace(session.home);
            return null;
        }

        return session;

    }

    function logout() {

        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(PENDING_KEY);
        localStorage.removeItem("isLoggedIn");

        window.location.replace(LOGIN_PAGE);

    }

    window.HHAuth = {
        establishSession: establishSession,
        getSession: getSession,
        requireRole: requireRole,
        logout: logout
    };

})();
