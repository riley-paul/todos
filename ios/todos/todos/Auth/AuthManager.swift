//
//  AuthManager.swift
//  todos
//
//  Created by Riley James Paul on 2025-11-23.
//

import AuthenticationServices
import SwiftUI
import Combine

@MainActor
class AuthManager: NSObject, ObservableObject {
    @Published var isAuthenticated = false

    private let sessionKey = "sessionId"

    override init() {
        super.init()
        self.isAuthenticated = Keychain.load(key: sessionKey) != nil
    }

    // MARK: - Launch OAuth login
    func signInWithGoogle() {
        let redirectURI = "com.riley-projects.auth:/oauth/google/callback"
        let authURL = URL(
            string:
                "\(Constants.apiURL)/auth/google?redirect_uri=\(redirectURI)"
        )!

        let session = ASWebAuthenticationSession(
            url: authURL,
            callbackURLScheme: "com.yourapp.auth"
        ) { callbackURL, error in
            if let callbackURL = callbackURL {
                self.handleOAuthCallback(url: callbackURL)
            }
        }

        session.presentationContextProvider = self
        session.prefersEphemeralWebBrowserSession = true

        session.start()
    }

    // MARK: - Handle redirect back
    private func handleOAuthCallback(url: URL) {
        guard
            let components = URLComponents(
                url: url,
                resolvingAgainstBaseURL: true
            ),
            let code = components.queryItems?.first(where: { $0.name == "code" }
            )?.value
        else { return }

        Task {
            await exchangeCodeForSession(code: code)
        }
    }

    // MARK: - Exchange code → sessionId with your backend
    private func exchangeCodeForSession(code: String) async {
        guard let url = URL(string: "\(Constants.apiURL)/auth/google/ios") else {
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["code": code]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let result = try JSONDecoder().decode(
                SessionResponse.self,
                from: data
            )

            Keychain.save(result.sessionId, key: sessionKey)
            self.isAuthenticated = true

        } catch {
            print("Error exchanging code:", error)
        }
    }

    // MARK: - Sign out
    func signOut() {
        Keychain.delete(key: sessionKey)
        isAuthenticated = false
    }
}

// MARK: - iOS requires this for ASWebAuthenticationSession
extension AuthManager: ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession)
        -> ASPresentationAnchor
    {
        UIApplication.shared.connectedScenes
            .compactMap { ($0 as? UIWindowScene)?.keyWindow }
            .first ?? ASPresentationAnchor()
    }
}

// MARK: - Response model
struct SessionResponse: Decodable {
    let sessionId: String
}
