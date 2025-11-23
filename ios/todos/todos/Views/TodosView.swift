import SwiftUI

struct TodosView: View {
    @StateObject private var vm = TodosViewModel()

    var body: some View {
        NavigationView {
            List(vm.todos) { todo in
                HStack {
                    Text(todo.text)
                    Spacer()
                    if todo.isCompleted { Image(systemName: "checkmark") }
                }
            }
            .refreshable { await vm.load() }
            .navigationTitle("Todos")
            .overlay {
                if vm.isLoading {
                    ProgressView()
                }
            }
            .task {
                await vm.load()
            }
            .alert("Error", isPresented: .constant(vm.error != nil)) {
                Button("OK") { vm.error = nil }
            } message: {
                Text(vm.error ?? "")
            }
        }
    }
}

#Preview {
    TodosView()
}
