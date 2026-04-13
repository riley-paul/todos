//
//  ContentView.swift
//  todos
//
//  Created by Riley James Paul on 2025-11-22.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Button(
                action: {},
                label: { Text("Login with Google") },
            ).buttonStyle(.glass).buttonSizing(.fitted)

        }
        .padding()
    }
}

#Preview {
    ContentView()
}
