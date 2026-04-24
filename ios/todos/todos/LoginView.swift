//
//  LoginView.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import SwiftUI
import AuthenticationServices

class AuthProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession)
        -> ASPresentationAnchor
    {
        return UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap { $0.windows }
            .first { $0.isKeyWindow }!
    }
}

struct LoginView: View {
    var body: some View {
        VStack {
            Button(
                action: startLogin,
                label: { Text("Login with Google") }
            )
            .buttonStyle(.glass)
            .buttonSizing(.fitted)
        }
        .padding()
    }
    
    private func startLogin() {
        print("starting login")

        if KeychainHelper.load(forKey: "session_token") != nil {
            print("Already logged in")
            return
        }

        let session = ASWebAuthenticationSession(
            url: loginUrl,
            callbackURLScheme: "todos"
        ) { callbackURL, error in
            guard
                let url = callbackURL,
                let token = URLComponents(
                    url: url,
                    resolvingAgainstBaseURL: false
                )?
                .queryItems?
                .first(where: { $0.name == "token" })?
                .value
            else {
                print(error)
                return
            }

            print("url", url)

            KeychainHelper.save(token, forKey: "session_token")
        }

        let provider = AuthProvider()

        session.presentationContextProvider = provider
        session.prefersEphemeralWebBrowserSession = true
        session.start()
    }
}

#Preview {
    LoginView()
}
