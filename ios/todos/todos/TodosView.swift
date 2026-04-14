//
//  TodosView.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import SwiftUI

struct TodosView: View {
    let listId: String

    @State private var todos: [TodoModel] = []
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
                List(todos) { todo in
                    HStack {

                        Button(action: {
                            toggleTodo(todo)
                        }) {
                            Image(
                                systemName: todo.isCompleted
                                    ? "checkmark.circle.fill" : "circle"
                            )
                            .foregroundStyle(todo.isCompleted ? .green : .gray)
                        }
                        .buttonStyle(.plain)

                        Text(todo.text)
                            .strikethrough(todo.isCompleted)
                            .foregroundStyle(
                                todo.isCompleted ? .secondary : .primary
                            )

                        Spacer()
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
            todos = try await apiService.request(
                "todos",
                query: [
                    URLQueryItem(name: "listId", value: listId)
                ]
            )
        } catch {
            self.error = error.localizedDescription
        }
    }

    func toggleTodo(_: TodoModel) {
        return
    }
}

#Preview {
    TodosView(listId: "d6f7b842-b46a-44d8-a608-0a969ecf80d7")
}
