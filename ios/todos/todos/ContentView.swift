//
//  ContentView.swift
//  todos
//
//  Created by Riley James Paul on 2025-11-22.
//

import AuthenticationServices
import SwiftUI

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

struct ContentView: View {

    var body: some View {
        if KeychainHelper.load(forKey: "session_token") == nil {
            return VStack {
                Button(
                    action: startLogin,
                    label: { Text("Login with Google") }
                )
                .buttonStyle(.glass)
                .buttonSizing(.fitted)
            }
            .padding()
        }

        return VStack {
            Text("Welcome to todos")
        }.padding()

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
    ContentView()
}
