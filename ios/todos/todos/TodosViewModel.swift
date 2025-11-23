import Foundation
import Combine

@MainActor
class TodosViewModel: ObservableObject {
    @Published var todos: [TodoSelect] = []
    @Published var isLoading: Bool = false
    @Published var error: String?

    func load() async {
        isLoading = true
        error = nil

        do {
            todos = try await ApiService.shared.fetchTodos()

        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

}
