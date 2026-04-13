//
//  ListsView.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import SwiftUI

struct ListsView: View {
    @State private var lists: [ListModel] = []
    @State private var isLoading = false
    @State private var error: String?

    private let apiService = ApiService()

    var body: some View {
        VStack {
            if isLoading {
                ProgressView()
            } else if let error {
                Text(error)
            } else {
                NavigationStack {
                    List(lists) { list in
                        NavigationLink(value: list) {
                            Text(list.name)
                        }
                    }
                    .navigationDestination(for: ListModel.self) { list in
                        ListDetailView(list: list)
                    }
                }
            }
        }
        .task {
            await loadTodos()
        }
    }

    func loadTodos() async {
        isLoading = true
        defer { isLoading = false }

        do {
            lists = try await apiService.request("lists")
        } catch {
            self.error = error.localizedDescription
        }
    }
}

#Preview {
    ListsView()
}
