//
//  ContentView.swift
//  todos
//
//  Created by Riley James Paul on 2025-11-22.
//

import SwiftUI

struct ContentView: View {

    var body: some View {
        if KeychainHelper.load(forKey: "session_token") == nil {
            LoginView()
        } else {
            VStack {
                Text("Welcome to todos")
            }.padding()
        }
    }
}

#Preview {
    ContentView()
}
